'use client'

import { formatCurrency, cn } from '@/lib/utils'
import { DollarSign, Package, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react'

interface BudgetSummaryProps {
  total: number
  budget: number
  remaining: number
  itemCount: number
}

export function BudgetSummary({ total, budget, remaining, itemCount }: BudgetSummaryProps) {
  const percentUsed = (total / budget) * 100
  const isOverBudget = remaining < 0
  const isNearBudget = remaining >= 0 && remaining < budget * 0.1

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Build Summary</h3>

        {/* Total Spend */}
        <div className="bg-gray-900 rounded-lg p-4 mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-400">Total Spend</span>
            <DollarSign className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-3xl font-bold text-white">{formatCurrency(total)}</div>
        </div>

        {/* Budget */}
        <div className="bg-gray-900 rounded-lg p-4 mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-400">Budget</span>
            <TrendingUp className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-semibold text-gray-300">{formatCurrency(budget)}</div>
        </div>

        {/* Remaining */}
        <div className={cn(
          "rounded-lg p-4 mb-3",
          isOverBudget ? "bg-red-900/30 border border-red-800" :
          isNearBudget ? "bg-yellow-900/30 border border-yellow-800" :
          "bg-green-900/30 border border-green-800"
        )}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-300">Remaining</span>
            {isOverBudget ? (
              <AlertTriangle className="w-4 h-4 text-red-400" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-green-400" />
            )}
          </div>
          <div className={cn(
            "text-2xl font-bold",
            isOverBudget ? "text-red-400" :
            isNearBudget ? "text-yellow-400" :
            "text-green-400"
          )}>
            {formatCurrency(Math.abs(remaining))}
            {isOverBudget && <span className="text-sm ml-1">over</span>}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
            <span>Budget Used</span>
            <span>{percentUsed.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-900 rounded-full h-3 overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-500 rounded-full",
                isOverBudget ? "bg-red-500" :
                isNearBudget ? "bg-yellow-500" :
                "bg-gradient-to-r from-blue-500 to-purple-500"
              )}
              style={{ width: `${Math.min(percentUsed, 100)}%` }}
            />
          </div>
        </div>

        {/* Item Count */}
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-400">Total Items</span>
            <Package className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-white">{itemCount}</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
          Save Build
        </button>
        <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
          Share Build
        </button>
        <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
          Export PDF
        </button>
      </div>
    </div>
  )
}
