'use client'

import { useState } from 'react'
import STLViewer from '@/components/STLViewer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Analysis {
  volume: number // cm³
  dimensions: { x: number; y: number; z: number } // mm
  triangles: number
  area: number // mm²
}

export default function STLViewerPage() {
  const [analysis, setAnalysis] = useState<Analysis | null>(null)

  const handleAnalysisComplete = (analysisData: Analysis) => {
    setAnalysis(analysisData)
    console.log('STL Analysis Complete:', analysisData)
  }

  // Simulează calculul de preț pentru material
  const calculateMaterialInfo = () => {
    if (!analysis) return null

    const materials = [
      { name: 'PLA', density: 1.24, pricePerGram: 0.05 },
      { name: 'PETG', density: 1.27, pricePerGram: 0.07 },
      { name: 'ABS', density: 1.04, pricePerGram: 0.06 },
    ]

    return materials.map(material => {
      const weight = (analysis.volume * material.density).toFixed(1) // grams
      const cost = (parseFloat(weight) * material.pricePerGram).toFixed(2)
      return { ...material, weight, cost }
    })
  }

  const materialInfo = calculateMaterialInfo()

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Analizor STL 3D
          </h1>
          <p className="text-slate-600">
            Încarcă fișiere STL pentru a calcula volumul, dimensiunile și alte proprietăți necesare pentru cotație.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* STL Viewer - Main Content */}
          <div>
            <STLViewer
              onAnalysisComplete={handleAnalysisComplete}
              className="w-full"
            />
          </div>

          {/* Analysis Results - Sidebar */}
          <div className="space-y-6">
            {/* Volume & Dimensions - Main Stats */}
            {analysis && (
              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-900">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Parametri Principali
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Volume */}
                  <div className="text-center p-6 bg-white rounded-lg border">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Volum</h3>
                    <div className="text-4xl font-bold text-blue-600 mb-1">
                      {analysis.volume.toFixed(2)}
                    </div>
                    <div className="text-slate-600 font-medium">cm³</div>
                  </div>

                  {/* Dimensions */}
                  <div className="bg-white rounded-lg border p-4">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Dimensiuni (mm)</h3>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
                        <span className="font-medium text-slate-700">Lungime (X):</span>
                        <Badge variant="outline" className="text-base font-bold">
                          {analysis.dimensions.x} mm
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
                        <span className="font-medium text-slate-700">Lățime (Y):</span>
                        <Badge variant="outline" className="text-base font-bold">
                          {analysis.dimensions.y} mm
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
                        <span className="font-medium text-slate-700">Înălțime (Z):</span>
                        <Badge variant="outline" className="text-base font-bold">
                          {analysis.dimensions.z} mm
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Additional Properties */}
                  <div className="bg-white rounded-lg border p-4">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Proprietăți Suplimentare</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Suprafața:</span>
                        <span className="font-medium">{analysis.area.toFixed(1)} mm²</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Triunghiuri:</span>
                        <span className="font-medium">{analysis.triangles.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Volum (mm³):</span>
                        <span className="font-medium">{(analysis.volume * 1000).toFixed(0)} mm³</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {!analysis && (
              <Card className="border-2 border-dashed border-slate-300">
                <CardContent className="text-center py-12">
                  <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    În așteptarea fișierului STL
                  </h3>
                  <p className="text-slate-500">
                    Încarcă un fișier STL pentru a vedea volumul și dimensiunile
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Material Calculator */}
            {materialInfo && (
              <Card>
                <CardHeader>
                  <CardTitle>Calculul Materialului</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {materialInfo.map((material) => (
                    <div key={material.name} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <div>
                        <div className="font-semibold text-slate-900">{material.name}</div>
                        <div className="text-sm text-slate-600">{material.weight}g</div>
                      </div>
                      <Badge variant="outline">
                        {material.cost} RON
                      </Badge>
                    </div>
                  ))}
                  <div className="text-xs text-slate-500 text-center pt-2 border-t">
                    * Calculat cu 100% infill
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Usage Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Instrucțiuni</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600 space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-slate-200 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">
                    1
                  </div>
                  <p>Selectează un fișier STL de pe calculatorul tău</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-slate-200 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">
                    2
                  </div>
                  <p>Așteaptă încărcarea și analiza fișierului</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-slate-200 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">
                    3
                  </div>
                  <p>Explorează modelul 3D cu mouse-ul</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-slate-200 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">
                    4
                  </div>
                  <p>Vezi rezultatele analizei în panoul din dreapta</p>
                </div>
              </CardContent>
            </Card>

            {/* Technical Details */}
            {analysis && (
              <Card>
                <CardHeader>
                  <CardTitle>Detalii Tehnice</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Triunghiuri:</span>
                    <span className="font-medium">{analysis.triangles.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Suprafața:</span>
                    <span className="font-medium">{analysis.area.toFixed(1)} mm²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Volum total:</span>
                    <span className="font-medium">{(analysis.volume * 1000).toFixed(0)} mm³</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Usage Example */}
        <div className="mt-12 bg-slate-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Integrarea în aplicație
          </h3>
          <div className="bg-white rounded border p-4 text-sm">
            <pre className="text-slate-700 whitespace-pre-wrap">
{`// Exemplu de utilizare în componentă:
import STLViewer from '@/components/STLViewer'

function MyComponent() {
  const handleAnalysis = (analysis) => {
    console.log('Volum:', analysis.volume, 'cm³')
    console.log('Dimensiuni:', analysis.dimensions)
    // Folosește datele pentru calculul prețului
  }

  return (
    <STLViewer onAnalysisComplete={handleAnalysis} />
  )
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}