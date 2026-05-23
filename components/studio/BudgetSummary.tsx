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
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-8 space-y-8 shadow-2xl backdrop-blur-sm">
      <div>
        <h3 className="text-2xl font-bold text-white mb-6 tracking-tight flex items-center gap-3">
          <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-orange-500 to-blue-500"></div>
          Build Summary
        </h3>

        {/* Total Spend */}
        <div className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 rounded-xl p-5 mb-4 border border-slate-700/30 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Total Spend</span>
            <DollarSign className="w-5 h-5 text-orange-500" />
          </div>
          <div className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
            {formatCurrency(total)}
          </div>
        </div>

        {/* Budget */}
        <div className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 rounded-xl p-5 mb-4 border border-slate-700/30 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Budget</span>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-slate-200">{formatCurrency(budget)}</div>
        </div>

        {/* Remaining */}
        <div className={cn(
          "rounded-xl p-5 mb-4 border shadow-xl transition-all duration-300",
          isOverBudget ? "bg-gradient-to-br from-red-900/40 to-red-950/40 border-red-800/50 shadow-red-900/20" :
          isNearBudget ? "bg-gradient-to-br from-yellow-900/40 to-yellow-950/40 border-yellow-800/50 shadow-yellow-900/20" :
          "bg-gradient-to-br from-emerald-900/40 to-emerald-950/40 border-emerald-800/50 shadow-emerald-900/20"
        )}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Remaining</span>
            {isOverBudget ? (
              <AlertTriangle className="w-5 h-5 text-red-400" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            )}
          </div>
          <div className={cn(
            "text-3xl font-bold",
            isOverBudget ? "text-red-400" :
            isNearBudget ? "text-yellow-400" :
            "text-emerald-400"
          )}>
            {formatCurrency(Math.abs(remaining))}
            {isOverBudget && <span className="text-lg ml-2 font-semibold">over</span>}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">
            <span>Budget Used</span>
            <span className="text-lg">{percentUsed.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-950/80 rounded-full h-4 overflow-hidden border border-slate-700/30 shadow-inner">
            <div
              className={cn(
                "h-full transition-all duration-500 rounded-full relative overflow-hidden",
                isOverBudget ? "bg-gradient-to-r from-red-500 to-red-600" :
                isNearBudget ? "bg-gradient-to-r from-yellow-500 to-yellow-600" :
                "bg-gradient-to-r from-orange-500 via-orange-600 to-blue-600"
              )}
              style={{ width: `${Math.min(percentUsed, 100)}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Item Count */}
        <div className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 rounded-xl p-5 border border-slate-700/30 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Total Items</span>
            <Package className="w-5 h-5 text-cyan-500" />
          </div>
          <div className="text-3xl font-bold text-white">{itemCount}</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-4 border-t border-slate-700/50">
        <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105">
          Save Build
        </button>
        <button className="w-full bg-slate-700/80 hover:bg-slate-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 border border-slate-600/50 hover:border-slate-500/50 hover:scale-105">
          Share Build
        </button>
        <button className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105">
          Export PDF
        </button>
      </div>
    </div>
  )
}
