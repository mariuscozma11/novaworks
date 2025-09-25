'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { STLLoader } from 'three/addons/loaders/STLLoader.js'
import { Upload, FileText, Package, Ruler, Calculator } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface STLViewerProps {
  onAnalysisComplete?: (analysis: {
    volume: number // cm³
    dimensions: { x: number; y: number; z: number } // mm
    triangles: number
    area: number // mm²
  }) => void
  className?: string
}

interface Analysis {
  volume: number // cm³
  dimensions: { x: number; y: number; z: number } // mm
  triangles: number
  area: number // mm²
}

const STLViewer: React.FC<STLViewerProps> = ({ onAnalysisComplete, className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const meshRef = useRef<THREE.Mesh | null>(null)
  const animationIdRef = useRef<number | undefined>(undefined)

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [error, setError] = useState<string>('')

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf8fafc)
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000,
    )
    camera.position.set(50, 50, 50)
    cameraRef.current = camera

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    mountRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.enableZoom = true
    controlsRef.current = controls

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(50, 50, 50)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    scene.add(directionalLight)

    // Grid
    const gridHelper = new THREE.GridHelper(100, 50, 0xe2e8f0, 0xe2e8f0)
    scene.add(gridHelper)

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current || !camera || !renderer) return

      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      const currentMount = mountRef.current
      if (currentMount && renderer.domElement && currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement)
      }
      renderer.dispose()
      controls.dispose()
    }
  }, [])

  // Calculate volume using the divergence theorem
  const calculateVolume = useCallback((geometry: THREE.BufferGeometry): number => {
    const positionAttribute = geometry.getAttribute('position')
    if (!positionAttribute) return 0

    const positions = positionAttribute.array as Float32Array
    let volume = 0

    // For each triangle, calculate the volume of tetrahedron formed with origin
    for (let i = 0; i < positions.length; i += 9) {
      // Get triangle vertices
      const v1 = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2])
      const v2 = new THREE.Vector3(positions[i + 3], positions[i + 4], positions[i + 5])
      const v3 = new THREE.Vector3(positions[i + 6], positions[i + 7], positions[i + 8])

      // Calculate volume of tetrahedron with origin (0,0,0)
      // Volume = (1/6) * |det(v1, v2, v3)|
      // But we need signed volume for proper calculation
      const det = v1.dot(v2.clone().cross(v3))
      volume += det / 6
    }

    return Math.abs(volume) // mm³
  }, [])

  // Calculate surface area
  const calculateSurfaceArea = useCallback((geometry: THREE.BufferGeometry): number => {
    const positionAttribute = geometry.getAttribute('position')
    if (!positionAttribute) return 0

    const positions = positionAttribute.array as Float32Array
    let area = 0

    for (let i = 0; i < positions.length; i += 9) {
      const v1 = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2])
      const v2 = new THREE.Vector3(positions[i + 3], positions[i + 4], positions[i + 5])
      const v3 = new THREE.Vector3(positions[i + 6], positions[i + 7], positions[i + 8])

      // Calculate triangle area using cross product
      const edge1 = v2.clone().sub(v1)
      const edge2 = v3.clone().sub(v1)
      const cross = edge1.cross(edge2)
      area += cross.length() * 0.5
    }

    return area // mm²
  }, [])

  // Load and analyze STL file
  const loadSTL = useCallback(
    async (file: File) => {
      if (!sceneRef.current || !cameraRef.current || !controlsRef.current) return

      setIsLoading(true)
      setError('')

      try {
        const loader = new STLLoader()
        const arrayBuffer = await file.arrayBuffer()

        // Load geometry
        const geometry = loader.parse(arrayBuffer)

        // Create material
        const material = new THREE.MeshPhongMaterial({
          color: 0x4f46e5,
          shininess: 100,
          side: THREE.DoubleSide,
        })

        // Remove existing mesh
        if (meshRef.current && sceneRef.current) {
          sceneRef.current.remove(meshRef.current)
        }

        // Create mesh
        const mesh = new THREE.Mesh(geometry, material)
        mesh.castShadow = true
        mesh.receiveShadow = true
        meshRef.current = mesh
        sceneRef.current.add(mesh)

        // Calculate bounding box
        const box = new THREE.Box3().setFromObject(mesh)
        const size = box.getSize(new THREE.Vector3())
        const center = box.getCenter(new THREE.Vector3())

        // Center the object
        mesh.position.sub(center)

        // Calculate properties
        const volume = calculateVolume(geometry) // mm³
        const volumeInCm3 = volume / 1000 // Convert to cm³
        const surfaceArea = calculateSurfaceArea(geometry) // mm²
        const triangles = geometry.attributes.position.count / 3

        // Fit camera to object
        const maxDim = Math.max(size.x, size.y, size.z)
        const fov = cameraRef.current.fov * (Math.PI / 180)
        const cameraDistance = Math.abs(maxDim / (2 * Math.tan(fov / 2))) * 1.5

        cameraRef.current.position.set(cameraDistance, cameraDistance, cameraDistance)
        cameraRef.current.lookAt(0, 0, 0)
        controlsRef.current.target.set(0, 0, 0)
        controlsRef.current.update()

        const analysisData: Analysis = {
          volume: volumeInCm3,
          dimensions: {
            x: Math.round(size.x * 10) / 10,
            y: Math.round(size.y * 10) / 10,
            z: Math.round(size.z * 10) / 10,
          },
          triangles: Math.round(triangles),
          area: Math.round(surfaceArea * 100) / 100,
        }

        setAnalysis(analysisData)
        onAnalysisComplete?.(analysisData)
      } catch (err) {
        console.error('Error loading STL:', err)
        setError('Eroare la încărcarea fișierului STL. Verifică că fișierul este valid.')
      } finally {
        setIsLoading(false)
      }
    },
    [calculateVolume, calculateSurfaceArea, onAnalysisComplete],
  )

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.toLowerCase().endsWith('.stl')) {
      setError('Te rugăm să selectezi un fișier STL valid.')
      return
    }

    console.log('Selected file:', file.name, file.size)
    setSelectedFile(file)
    setError('')
    loadSTL(file)
  }

  // Handle drag and drop
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()

    const file = event.dataTransfer.files?.[0]
    if (!file) return

    if (!file.name.toLowerCase().endsWith('.stl')) {
      setError('Te rugăm să selectezi un fișier STL valid.')
      return
    }

    console.log('Dropped file:', file.name, file.size)
    setSelectedFile(file)
    setError('')
    loadSTL(file)
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }

  return (
    <div className={`w-full ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Analizor STL 3D
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Input */}
          <div
            className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input
              type="file"
              accept=".stl"
              onChange={handleFileChange}
              className="hidden"
              id="stl-upload"
            />
            <label htmlFor="stl-upload" className="cursor-pointer block">
              <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 mb-2 font-medium">
                {selectedFile ? `✓ ${selectedFile.name}` : 'Încarcă fișierul STL'}
              </p>
              <p className="text-sm text-slate-500 mb-4">
                Click pentru a selecta sau trage fișierul aici
              </p>
              <Button type="button" variant="outline" className="mt-2">
                {selectedFile ? 'Schimbă Fișierul' : 'Selectează Fișier'}
              </Button>
            </label>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* 3D Viewer */}
          <div className="relative">
            <div
              ref={mountRef}
              className="w-full h-96 bg-slate-100 rounded-lg border border-slate-300 overflow-hidden"
              style={{ minHeight: '384px' }}
            />

            {isLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                  <span className="text-slate-600">Analizează fișierul...</span>
                </div>
              </div>
            )}
          </div>

          {/* Analysis Results */}
          {analysis && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Dimensions */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Ruler className="w-4 h-4" />
                    Dimensiuni
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Lungime (X):</span>
                    <Badge variant="outline">{analysis.dimensions.x} mm</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Lățime (Y):</span>
                    <Badge variant="outline">{analysis.dimensions.y} mm</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Înălțime (Z):</span>
                    <Badge variant="outline">{analysis.dimensions.z} mm</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Properties */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Calculator className="w-4 h-4" />
                    Proprietăți
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Volum:</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      {analysis.volume.toFixed(2)} cm³
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Suprafața:</span>
                    <Badge variant="outline">{analysis.area.toFixed(1)} mm²</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Triunghiuri:</span>
                    <Badge variant="outline">{analysis.triangles.toLocaleString()}</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {selectedFile && !isLoading && !analysis && (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">În așteptarea analizei...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default STLViewer
