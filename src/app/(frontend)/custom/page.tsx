'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Upload,
  Package,
  Calculator,
  Palette,
  Info,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import STLViewer from '@/components/STLViewer'

interface STLAnalysis {
  volume: number // cm³
  dimensions: { x: number; y: number; z: number } // mm
  triangles: number
  area: number // mm²
}

interface InstantQuote {
  materialCost: number
  printTimeCost: number
  setupCost: number
  total: number
  materialWeight: number
  printTime: number
}

export default function CustomOrdersPage() {
  const [stlAnalysis, setStlAnalysis] = useState<STLAnalysis | null>(null)
  const [selectedMaterial, setSelectedMaterial] = useState('')
  const [infill, setInfill] = useState(20)
  const [quantity, setQuantity] = useState(1)
  const [instantQuote, setInstantQuote] = useState<InstantQuote | null>(null)

  // Material definitions with properties for calculation
  const materials = [
    {
      id: 'pla',
      name: 'PLA',
      pricePerGram: 0.05,
      density: 1.24,
      description: 'Biodegradabil, ușor de imprimat',
      color: 'bg-green-500',
    },
    {
      id: 'petg',
      name: 'PETG',
      pricePerGram: 0.07,
      density: 1.27,
      description: 'Transparent, rezistent la impact',
      color: 'bg-blue-500',
    },
    {
      id: 'abs',
      name: 'ABS',
      pricePerGram: 0.06,
      density: 1.04,
      description: 'Durabil, rezistent la căldură',
      color: 'bg-orange-500',
    },
    {
      id: 'tpu',
      name: 'TPU',
      pricePerGram: 0.12,
      density: 1.2,
      description: 'Flexibil, elastic',
      color: 'bg-purple-500',
    },
  ]

  // Calculate instant quote
  const calculateQuote = useCallback(() => {
    if (!stlAnalysis || !selectedMaterial) {
      setInstantQuote(null)
      return
    }

    const material = materials.find((m) => m.id === selectedMaterial)
    if (!material) return

    // Calculate material weight based on volume, infill and material density
    const solidVolume = (stlAnalysis.volume * infill) / 100 // cm³
    const materialWeight = solidVolume * material.density // grams
    const materialCost = materialWeight * material.pricePerGram

    // Estimate print time (enhanced formula)
    const baseTimePerCm3 = 0.6 // hours per cm³ base time
    const infillTimeMultiplier = 0.3 + (infill / 100) * 0.7 // infill affects time more realistically
    const complexityMultiplier = Math.min(1.5, stlAnalysis.triangles / 10000) // more triangles = more complex
    const estimatedPrintTime =
      stlAnalysis.volume * baseTimePerCm3 * infillTimeMultiplier * complexityMultiplier

    // Calculate costs
    const printTimeCost = estimatedPrintTime * 10 // 10 RON per hour
    const setupCost = 25 // Fixed setup cost
    const subtotal = (materialCost + printTimeCost + setupCost) * quantity

    setInstantQuote({
      materialCost: materialCost * quantity,
      printTimeCost: printTimeCost * quantity,
      setupCost,
      total: subtotal,
      materialWeight: materialWeight * quantity,
      printTime: estimatedPrintTime * quantity,
    })
  }, [stlAnalysis, selectedMaterial, infill, quantity, materials])

  // Handle STL analysis completion
  const handleSTLAnalysis = (analysis: STLAnalysis) => {
    setStlAnalysis(analysis)
  }

  // Auto-calculate quote when parameters change
  useEffect(() => {
    calculateQuote()
  }, [calculateQuote])

  // Check if part fits on build plate
  const checkBuildPlateFit = () => {
    if (!stlAnalysis) return { fits: false, message: 'Analiză necesară' }

    const maxX = stlAnalysis.dimensions.x
    const maxY = stlAnalysis.dimensions.y
    const maxZ = stlAnalysis.dimensions.z
    const buildPlateSize = 256 // mm

    if (maxX <= buildPlateSize && maxY <= buildPlateSize && maxZ <= buildPlateSize) {
      return {
        fits: true,
        message: `Piesa se încadrează perfect (${maxX.toFixed(1)}×${maxY.toFixed(1)}×${maxZ.toFixed(1)}mm)`,
      }
    } else {
      const exceedsX = maxX > buildPlateSize
      const exceedsY = maxY > buildPlateSize
      const exceedsZ = maxZ > buildPlateSize
      const exceededDims = []
      if (exceedsX) exceededDims.push(`X: ${maxX.toFixed(1)}mm`)
      if (exceedsY) exceededDims.push(`Y: ${maxY.toFixed(1)}mm`)
      if (exceedsZ) exceededDims.push(`Z: ${maxZ.toFixed(1)}mm`)

      return {
        fits: false,
        message: `Depășește placa de imprimare (${exceededDims.join(', ')} > 256mm)`,
      }
    }
  }

  const buildPlateFit = checkBuildPlateFit()
  const canCalculateQuote = stlAnalysis && selectedMaterial
  const _isReadyToOrder = canCalculateQuote && buildPlateFit.fits

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Comandă Personalizată</h1>
          <p className="text-lg text-slate-600">
            Încarcă fișierul STL, selectează materialul și obține o cotație instantanee
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* STL Upload & Viewer */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Încarcă Fișierul STL
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <STLViewer onAnalysisComplete={handleSTLAnalysis} className="w-full" />

                {/* Analysis Results */}
                {stlAnalysis && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="w-4 h-4 text-slate-600" />
                        <span className="font-medium text-slate-900">Proprietăți</span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Volum:</span>
                          <span className="font-medium">{stlAnalysis.volume.toFixed(2)} cm³</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Suprafața:</span>
                          <span className="font-medium">
                            {(stlAnalysis.area / 100).toFixed(1)} cm²
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Triunghiuri:</span>
                          <span className="font-medium">
                            {stlAnalysis.triangles.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calculator className="w-4 h-4 text-slate-600" />
                        <span className="font-medium text-slate-900">Dimensiuni (mm)</span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Lungime (X):</span>
                          <span className="font-medium">{stlAnalysis.dimensions.x} mm</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Lățime (Y):</span>
                          <span className="font-medium">{stlAnalysis.dimensions.y} mm</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Înălțime (Z):</span>
                          <span className="font-medium">{stlAnalysis.dimensions.z} mm</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Build Plate Verification */}
                {stlAnalysis && (
                  <div
                    className={`p-4 rounded-lg border ${
                      buildPlateFit.fits
                        ? 'bg-green-50 border-green-200'
                        : 'bg-orange-50 border-orange-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {buildPlateFit.fits ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                      )}
                      <span
                        className={`font-medium ${
                          buildPlateFit.fits ? 'text-green-900' : 'text-orange-900'
                        }`}
                      >
                        {buildPlateFit.fits ? 'Încadrare validată' : 'Atenție la dimensiuni'}
                      </span>
                    </div>
                    <p
                      className={`text-sm mt-1 ${
                        buildPlateFit.fits ? 'text-green-700' : 'text-orange-700'
                      }`}
                    >
                      {buildPlateFit.message}
                    </p>
                    <div className="mt-2 text-xs text-slate-600">
                      Placa de imprimare disponibilă: 256 × 256 × 256 mm
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Material Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Selectează Materialul
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {materials.map((material) => (
                    <div
                      key={material.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedMaterial === material.id
                          ? 'border-slate-900 bg-slate-50 ring-2 ring-slate-900 ring-opacity-20'
                          : 'border-slate-200 hover:border-slate-400 hover:shadow-sm'
                      }`}
                      onClick={() => setSelectedMaterial(material.id)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full ${material.color}`}></div>
                          <h4 className="font-semibold text-slate-900">{material.name}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {(material.pricePerGram * 100).toFixed(1)} RON/100g
                          </Badge>
                          {selectedMaterial === material.id && (
                            <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{material.description}</p>
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Densitate: {material.density} g/cm³</span>
                        <span>Preț: {material.pricePerGram} RON/g</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Print Parameters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Parametri de Imprimare
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Infill Control */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-700">
                      Infill: {infill}%
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={infill}
                      onChange={(e) => setInfill(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>10% (Rapid)</span>
                      <span>50% (Standard)</span>
                      <span>100% (Solid)</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <p className="text-xs text-slate-600">
                        <strong>
                          {infill <= 20
                            ? 'Rapid & Economic'
                            : infill <= 50
                              ? 'Standard'
                              : infill <= 80
                                ? 'Rezistent'
                                : 'Ultra-Solid'}
                        </strong>{' '}
                        -
                        {infill <= 20
                          ? ' Ideal pentru prototipuri și piese decorative'
                          : infill <= 50
                            ? ' Echilibru între rezistență și timp'
                            : infill <= 80
                              ? ' Piese care suportă forțe mari'
                              : ' Maxim de rezistență și durabilitate'}
                      </p>
                    </div>
                  </div>

                  {/* Quantity Control */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-700">Cantitate</label>
                    <Input
                      type="number"
                      min="1"
                      max="50"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full text-lg"
                    />
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <div className="text-xs text-slate-600 space-y-1">
                        <div>• Cantități mari: reduceri automate</div>
                        <div>• Timp livrare: 2-5 zile lucrătoare</div>
                        <div>• Maximum: 50 piese per comandă</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-700">
                    Presetări Rapide
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInfill(15)}
                      className={infill === 15 ? 'bg-slate-100' : ''}
                    >
                      Prototip (15%)
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInfill(30)}
                      className={infill === 30 ? 'bg-slate-100' : ''}
                    >
                      Standard (30%)
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInfill(80)}
                      className={infill === 80 ? 'bg-slate-100' : ''}
                    >
                      Rezistent (80%)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Button (Disabled) */}
            <Card>
              <CardContent className="pt-6">
                <Button
                  size="lg"
                  disabled={true}
                  className="w-full bg-slate-400 cursor-not-allowed"
                >
                  Comandă Acum - În Dezvoltare
                </Button>
                <p className="text-xs text-slate-500 text-center mt-2">
                  Funcția de comandă va fi disponibilă în curând
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Instant Quote */}
            {canCalculateQuote && instantQuote && (
              <Card className="border-slate-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900">
                    <Calculator className="w-5 h-5" />
                    Cotație Instantanee
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Total Price - Prominent */}
                  <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-lg p-4 text-center">
                    <div className="text-sm text-slate-300 mb-1">Total estimat</div>
                    <div className="text-3xl font-bold">{instantQuote.total.toFixed(2)} RON</div>
                    <div className="text-sm text-slate-300">
                      pentru {quantity} {quantity === 1 ? 'bucată' : 'bucăți'}
                    </div>
                  </div>

                  <Separator />

                  {/* Quote Breakdown */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-slate-900">Detalii Preț</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">
                          Material ({materials.find((m) => m.id === selectedMaterial)?.name})
                        </span>
                        <span className="font-medium">
                          {instantQuote.materialCost.toFixed(2)} RON
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-500">
                        <span className="ml-2">
                          → {instantQuote.materialWeight.toFixed(1)}g ×{' '}
                          {materials.find((m) => m.id === selectedMaterial)?.pricePerGram} RON/g
                        </span>
                        <span></span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Timp imprimare</span>
                        <span className="font-medium">
                          {instantQuote.printTimeCost.toFixed(2)} RON
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-500">
                        <span className="ml-2">
                          → {instantQuote.printTime.toFixed(1)}h × 10 RON/h
                        </span>
                        <span></span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Setup & procesare</span>
                        <span className="font-medium">{instantQuote.setupCost.toFixed(2)} RON</span>
                      </div>
                      {quantity > 1 && (
                        <div className="flex justify-between text-xs text-slate-500 border-t pt-2">
                          <span>Cantitate</span>
                          <span>× {quantity}</span>
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center font-semibold text-slate-900">
                      <span>Total</span>
                      <span className="text-lg">{instantQuote.total.toFixed(2)} RON</span>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Info className="w-4 h-4 text-yellow-600" />
                      <span className="text-xs font-medium text-yellow-900">Informații</span>
                    </div>
                    <div className="text-xs text-yellow-800 space-y-1">
                      <div>• Preț estimativ, poate varia ±10%</div>
                      <div>• Include verificare calitate</div>
                      <div>• Garanție defecte fabricație</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* No Quote State */}
            {!canCalculateQuote && (
              <Card className="border-dashed border-slate-300">
                <CardContent className="text-center py-8">
                  <Calculator className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="font-medium text-slate-900 mb-2">Cotație Indisponibilă</h3>
                  <p className="text-sm text-slate-500 mb-3">Pentru a calcula prețul:</p>
                  <div className="text-xs text-slate-500 space-y-1 text-left max-w-48 mx-auto">
                    <div className="flex items-center gap-2">
                      {stlAnalysis ? (
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      ) : (
                        <div className="w-3 h-3 border border-slate-300 rounded-full" />
                      )}
                      <span>Încarcă fișierul STL</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedMaterial ? (
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      ) : (
                        <div className="w-3 h-3 border border-slate-300 rounded-full" />
                      )}
                      <span>Selectează materialul</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Build Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Specificații Printer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Volum maxim:</span>
                    <span className="font-medium">256×256×256 mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Precizie:</span>
                    <span className="font-medium">±0.1 mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Grosime strat:</span>
                    <span className="font-medium">0.1-0.3 mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Temperatură max:</span>
                    <span className="font-medium">280°C</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Calculul Prețului</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Material:</span>
                    <span>Volum × Densitate × Preț</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Imprimare:</span>
                    <span>10 RON/oră</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Setup:</span>
                    <span>25 RON fix</span>
                  </div>
                </div>

                <Separator />

                <div className="text-xs text-slate-500 space-y-1">
                  <div>• Factori: volum, infill, complexitate</div>
                  <div>• Reduceri pentru cantități mari</div>
                  <div>• Prețuri actualizate săptămânal</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #1e293b;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #1e293b;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  )
}
