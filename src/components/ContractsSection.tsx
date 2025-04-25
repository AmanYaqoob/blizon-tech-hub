
import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Client, Project, Contract, ContractMilestone } from '@/lib/types';
import { generateId, getClientById, getProjectById } from '@/lib/data';

interface ContractsSectionProps {
  contracts: Contract[];
  clients: Client[];
  projects: Project[];
  onAddContract: (contract: Contract) => void;
}

export const ContractsSection = ({ 
  contracts, 
  clients, 
  projects,
  onAddContract 
}: ContractsSectionProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newContract, setNewContract] = useState<Partial<Contract>>({
    title: '',
    clientId: '',
    projectId: '',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    totalValue: 0,
    milestones: [],
  });
  
  const [newMilestone, setNewMilestone] = useState<Partial<ContractMilestone>>({
    title: '',
    description: '',
    dueDate: new Date(),
    amount: 0,
    isCompleted: false,
  });
  
  const { toast } = useToast();
  
  const filteredContracts = contracts.filter(contract => 
    contract.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    getClientById(contract.clientId)?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getProjectById(contract.projectId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'totalValue') {
      setNewContract(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setNewContract(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleMilestoneInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'amount') {
      setNewMilestone(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setNewMilestone(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: keyof Contract, value: string) => {
    setNewContract(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name: string, value: string) => {
    setNewContract(prev => ({ ...prev, [name]: new Date(value) }));
  };

  const handleMilestoneDateChange = (value: string) => {
    setNewMilestone(prev => ({ ...prev, dueDate: new Date(value) }));
  };

  const addMilestone = () => {
    if (newMilestone.title && newMilestone.description && newMilestone.dueDate && newMilestone.amount) {
      const milestone = {
        ...newMilestone,
        id: generateId('milestone'),
        isCompleted: false,
      } as ContractMilestone;
      
      setNewContract(prev => ({
        ...prev,
        milestones: [...(prev.milestones || []), milestone],
        totalValue: (prev.totalValue || 0) + milestone.amount
      }));
      
      setNewMilestone({
        title: '',
        description: '',
        dueDate: new Date(),
        amount: 0,
        isCompleted: false,
      });
    } else {
      toast({
        title: 'Error',
        description: 'Please fill in all milestone fields',
        variant: 'destructive',
      });
    }
  };

  const removeMilestone = (index: number) => {
    const milestonesToKeep = [...(newContract.milestones || [])];
    const removedAmount = milestonesToKeep[index].amount || 0;
    milestonesToKeep.splice(index, 1);
    
    setNewContract(prev => ({
      ...prev,
      milestones: milestonesToKeep,
      totalValue: (prev.totalValue || 0) - removedAmount
    }));
  };

  const handleAddContract = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newContract.milestones?.length) {
      toast({
        title: 'Error',
        description: 'Please add at least one milestone to the contract',
        variant: 'destructive',
      });
      return;
    }
    
    // Create new contract
    const contract = {
      ...newContract,
      id: generateId('contract'),
    } as Contract;
    
    onAddContract(contract);
    
    // Show success message
    toast({
      title: 'Contract added successfully',
      description: `${contract.title} has been added to your contracts.`,
    });
    
    // Reset form and close dialog
    setNewContract({
      title: '',
      clientId: '',
      projectId: '',
      description: '',
      startDate: new Date(),
      endDate: new Date(),
      totalValue: 0,
      milestones: [],
    });
    setOpen(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Contracts</h2>
          <p className="text-gray-500">Manage client contracts and milestones</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
              Create Contract
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Create New Contract</DialogTitle>
              <DialogDescription>
                Fill in the contract details and add milestones.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddContract}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div className="space-y-4">
                  <h3 className="font-medium">Contract Details</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title" 
                      value={newContract.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="clientId">Client</Label>
                    <Select
                      value={newContract.clientId}
                      onValueChange={(value) => handleSelectChange('clientId', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map(client => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name} - {client.company}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="projectId">Related Project</Label>
                    <Select
                      value={newContract.projectId}
                      onValueChange={(value) => handleSelectChange('projectId', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map(project => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={newContract.description}
                      onChange={handleInputChange}
                      rows={3}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        name="startDate"
                        type="date"
                        value={newContract.startDate ? new Date(newContract.startDate).toISOString().split('T')[0] : ''}
                        onChange={(e) => handleDateChange('startDate', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        name="endDate"
                        type="date"
                        value={newContract.endDate ? new Date(newContract.endDate).toISOString().split('T')[0] : ''}
                        onChange={(e) => handleDateChange('endDate', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="totalValue">Total Value ($)</Label>
                    <Input
                      id="totalValue"
                      name="totalValue"
                      type="number"
                      min="0"
                      step="0.01"
                      readOnly
                      value={newContract.totalValue}
                    />
                    <p className="text-xs text-gray-500">This will be calculated from milestones</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Milestones</h3>
                  
                  <div className="space-y-4 border rounded-md p-4 bg-gray-50">
                    <div className="space-y-2">
                      <Label htmlFor="milestoneTitle">Milestone Title</Label>
                      <Input
                        id="milestoneTitle"
                        name="title" 
                        value={newMilestone.title}
                        onChange={handleMilestoneInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="milestoneDescription">Description</Label>
                      <Textarea
                        id="milestoneDescription"
                        name="description"
                        value={newMilestone.description}
                        onChange={handleMilestoneInputChange}
                        rows={2}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="milestoneDueDate">Due Date</Label>
                        <Input
                          id="milestoneDueDate"
                          name="dueDate"
                          type="date"
                          value={newMilestone.dueDate ? new Date(newMilestone.dueDate).toISOString().split('T')[0] : ''}
                          onChange={(e) => handleMilestoneDateChange(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="milestoneAmount">Amount ($)</Label>
                        <Input
                          id="milestoneAmount"
                          name="amount"
                          type="number"
                          min="0"
                          step="0.01"
                          value={newMilestone.amount}
                          onChange={handleMilestoneInputChange}
                        />
                      </div>
                    </div>
                    
                    <Button type="button" onClick={addMilestone} className="w-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
                      Add Milestone
                    </Button>
                  </div>
                  
                  <div className="border rounded-md max-h-64 overflow-y-auto">
                    {newContract.milestones && newContract.milestones.length > 0 ? (
                      <div className="divide-y">
                        {newContract.milestones.map((milestone, index) => (
                          <div key={index} className="p-3 hover:bg-gray-50">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{milestone.title}</h4>
                                <p className="text-sm text-gray-500">{milestone.description}</p>
                                <div className="flex items-center mt-1 text-xs text-gray-500">
                                  <span>
                                    Due: {new Date(milestone.dueDate).toLocaleDateString()}
                                  </span>
                                  <span className="mx-2">•</span>
                                  <span>
                                    ${milestone.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                  </span>
                                </div>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => removeMilestone(index)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-gray-500">
                        No milestones added yet
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={!newContract.milestones?.length}>
                  Create Contract
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="mb-4 w-full max-w-sm">
        <Input
          placeholder="Search contracts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {filteredContracts.map((contract) => {
          const client = getClientById(contract.clientId);
          const project = getProjectById(contract.projectId);
          
          const completedMilestones = contract.milestones.filter(m => m.isCompleted).length;
          const totalMilestones = contract.milestones.length;
          const progressPercentage = totalMilestones > 0 
            ? Math.round((completedMilestones / totalMilestones) * 100) 
            : 0;
            
          return (
            <Card key={contract.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{contract.title}</CardTitle>
                    <CardDescription>
                      {client?.name} • {project?.name}
                    </CardDescription>
                  </div>
                  <div className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full">
                    ${contract.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm">{contract.description}</div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm">{progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Milestones</h4>
                  {contract.milestones.map((milestone, index) => (
                    <div 
                      key={milestone.id}
                      className={`p-3 border rounded-md ${
                        milestone.isCompleted ? 'bg-gray-50' : 'bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              milestone.isCompleted ? 'bg-green-500' : 'bg-amber-500'
                            }`}></div>
                            <h5 className="font-medium text-sm">{milestone.title}</h5>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{milestone.description}</p>
                        </div>
                        <div className="text-right text-xs">
                          <div className="font-medium">
                            ${milestone.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </div>
                          <div className="text-gray-500 mt-1">
                            Due: {new Date(milestone.dueDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center text-xs text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                  {new Date(contract.startDate).toLocaleDateString()} - {new Date(contract.endDate).toLocaleDateString()}
                </div>
                
                <div className="flex justify-end pt-2">
                  <Button variant="outline" size="sm" className="mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M21 11v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8"/><path d="M17.6 2.5H21v3.4"/><path d="M21 2.5 12 11.5"/></svg>
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {filteredContracts.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-gray-500">No contracts found. Try adjusting your search or create a new contract.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractsSection;
