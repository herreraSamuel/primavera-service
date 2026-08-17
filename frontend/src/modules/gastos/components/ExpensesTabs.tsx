interface ExpensesTabsProps {
    activeTab: 'FIJOS' | 'VARIABLES';
    setActiveTab: (tab: 'FIJOS' | 'VARIABLES') => void;
    fixedPendingCount: number;
}

export function ExpensesTabs({ activeTab, setActiveTab, fixedPendingCount }: ExpensesTabsProps) {
    return (
        <div className="flex space-x-3 mt-8 mb-6">
            <button
                onClick={() => setActiveTab('FIJOS')}
                className={`flex items-center px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                    activeTab === 'FIJOS'
                        ? 'bg-[#FDBA31] text-[#0F1923] shadow-sm'
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
            >
                Gastos Fijos
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                    activeTab === 'FIJOS' 
                        ? 'bg-[#0F1923] text-[#FDBA31]' 
                        : 'bg-[#FDBA31] text-[#0F1923]'
                }`}>
                    {fixedPendingCount}
                </span>
            </button>
            <button
                onClick={() => setActiveTab('VARIABLES')}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                    activeTab === 'VARIABLES'
                        ? 'bg-[#FDBA31] text-[#0F1923] shadow-sm'
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
            >
                Gastos Variables
            </button>
        </div>
    );
}
