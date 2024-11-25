import { useStore } from '../store';
import type { Contract, ContractStatus } from '../types';

export function useContracts() {
  const { contracts, addContract, updateContractStatus } = useStore();

  const createContract = (contractData: Omit<Contract, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
    const newContract: Contract = {
      ...contractData,
      id: Math.random().toString(36).substring(7),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addContract(newContract);
    return newContract;
  };

  const updateStatus = (contractId: string, status: ContractStatus) => {
    updateContractStatus(contractId, status);
  };

  const getContractsByUser = (userId: string, userType: 'client' | 'driver') => {
    return contracts.filter((contract) => 
      userType === 'client' 
        ? contract.clientId === userId 
        : contract.driverId === userId
    );
  };

  return {
    contracts,
    createContract,
    updateStatus,
    getContractsByUser,
  };
}