
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { Intern, InternStatus } from '@/lib/types';
import { generateId } from '@/lib/data';

interface InternsSectionProps {
  interns: Intern[];
  onAddIntern: (intern: Intern) => void;
}

export const InternsSection = ({ interns, onAddIntern }: InternsSectionProps) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<InternStatus>('Onboard');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newIntern, setNewIntern] = useState<Partial<Intern>>({
    name: '',
    email: '',
    phone: '',
    university: '',
    department: '',
    status: 'Onboard',
    startDate: new Date(),
    endDate: new Date(),
  });
  
  const { toast } = useToast();
  
  const departments = ['Engineering', 'Design', 'Management', 'Marketing', 'Sales', 'Support'];
  
  const filteredInterns = interns
    .filter(intern => intern.status === activeTab)
    .filter(intern => 
      intern.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      intern.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intern.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewIntern(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: keyof Intern, value: any) => {
    setNewIntern(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name: string, value: string) => {
    setNewIntern(prev => ({ ...prev, [name]: new Date(value) }));
  };

  const handleAddIntern = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new intern
    const intern = {
      ...newIntern,
      id: generateId('intern'),
    } as Intern;
    
    onAddIntern(intern);
    
    // Show success message
    toast({
      title: 'Intern added successfully',
      description: `${intern.name} has been added to your interns.`,
    });
    
    // Reset form and close dialog
    setNewIntern({
      name: '',
      email: '',
      phone: '',
      university: '',
      department: '',
      status: 'Onboard',
      startDate: new Date(),
      endDate: new Date(),
    });
    setOpen(false);
  };
  
  const getStatusColor = (status: InternStatus) => {
    switch (status) {
      case 'Onboard':
        return 'bg-green-100 text-green-800';
      case 'Postponed':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Interns</h2>
          <p className="text-gray-500">Manage your interns program</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
              Add Intern
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Intern</DialogTitle>
              <DialogDescription>
                Enter the intern's information below.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddIntern}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input
                    id="name"
                    name="name" 
                    value={newIntern.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="email" className="text-right">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={newIntern.email}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="phone" className="text-right">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={newIntern.phone}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="university" className="text-right">University</Label>
                  <Input
                    id="university"
                    name="university"
                    value={newIntern.university}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="department" className="text-right">Department</Label>
                  <div className="col-span-3">
                    <Select
                      value={newIntern.department}
                      onValueChange={(value) => handleSelectChange('department', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map(department => (
                          <SelectItem key={department} value={department}>
                            {department}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="status" className="text-right">Status</Label>
                  <div className="col-span-3">
                    <Select
                      value={newIntern.status}
                      onValueChange={(value: InternStatus) => handleSelectChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Onboard">Onboard</SelectItem>
                        <SelectItem value="Postponed">Postponed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="startDate" className="text-right">Start Date</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={newIntern.startDate ? new Date(newIntern.startDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => handleDateChange('startDate', e.target.value)}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="endDate" className="text-right">End Date</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={newIntern.endDate ? new Date(newIntern.endDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => handleDateChange('endDate', e.target.value)}
                    className="col-span-3"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Intern</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="Onboard" onValueChange={(value) => setActiveTab(value as InternStatus)}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="Onboard">Onboard</TabsTrigger>
            <TabsTrigger value="Postponed">Postponed</TabsTrigger>
          </TabsList>
          
          <div className="w-64">
            <Input
              placeholder="Search interns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
        
        <TabsContent value="Onboard" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInterns.map((intern) => (
              <div key={intern.id} className="dashboard-card">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{intern.name}</h3>
                    <p className="text-sm text-gray-500">{intern.university}</p>
                  </div>
                  <div className={`${getStatusColor(intern.status)} text-xs px-2.5 py-0.5 rounded-full`}>
                    {intern.status}
                  </div>
                </div>
                <div className="mt-2 inline-block bg-gray-100 text-gray-800 text-xs px-2.5 py-0.5 rounded-full">
                  {intern.department}
                </div>
                
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-gray-400"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    {intern.phone}
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-gray-400"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    {intern.email}
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-gray-400"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                    {intern.startDate.toLocaleDateString()} - {intern.endDate.toLocaleDateString()}
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t flex justify-between items-center text-sm">
                  <Button variant="ghost" size="sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                    <span className="ml-1">Edit</span>
                  </Button>
                  {intern.status === 'Onboard' && (
                    <Button variant="ghost" size="sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
                      <span className="ml-1">Postpone</span>
                    </Button>
                  )}
                  {intern.status === 'Postponed' && (
                    <Button variant="ghost" size="sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg>
                      <span className="ml-1">Onboard</span>
                    </Button>
                  )}
                </div>
              </div>
            ))}
            
            {filteredInterns.length === 0 && (
              <div className="col-span-3 py-8 text-center">
                <p className="text-gray-500">No {activeTab.toLowerCase()} interns found. Try adjusting your search or add a new intern.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="Postponed" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInterns.map((intern) => (
              <div key={intern.id} className="dashboard-card">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{intern.name}</h3>
                    <p className="text-sm text-gray-500">{intern.university}</p>
                  </div>
                  <div className={`${getStatusColor(intern.status)} text-xs px-2.5 py-0.5 rounded-full`}>
                    {intern.status}
                  </div>
                </div>
                <div className="mt-2 inline-block bg-gray-100 text-gray-800 text-xs px-2.5 py-0.5 rounded-full">
                  {intern.department}
                </div>
                
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-gray-400"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    {intern.phone}
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-gray-400"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    {intern.email}
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-gray-400"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                    {intern.startDate.toLocaleDateString()} - {intern.endDate.toLocaleDateString()}
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t flex justify-between items-center text-sm">
                  <Button variant="ghost" size="sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                    <span className="ml-1">Edit</span>
                  </Button>
                  {intern.status === 'Onboard' && (
                    <Button variant="ghost" size="sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
                      <span className="ml-1">Postpone</span>
                    </Button>
                  )}
                  {intern.status === 'Postponed' && (
                    <Button variant="ghost" size="sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg>
                      <span className="ml-1">Onboard</span>
                    </Button>
                  )}
                </div>
              </div>
            ))}
            
            {filteredInterns.length === 0 && (
              <div className="col-span-3 py-8 text-center">
                <p className="text-gray-500">No {activeTab.toLowerCase()} interns found. Try adjusting your search or add a new intern.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InternsSection;
