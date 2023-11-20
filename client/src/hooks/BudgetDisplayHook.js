import { useState } from 'react';
import { BudgetDisplayContext } from '../contexts/BudgetDisplayContext';

function BudgetDisplayHook() {
  const [hasBudget, setHasBudget] = useState(false);

  return (
    <BudgetDisplayContext.Provider value={{hasBudget, setHasBudget}}/>
  )
}


export default BudgetDisplayHook;