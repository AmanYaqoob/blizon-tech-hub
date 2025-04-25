
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
import { useToast } from '@/hooks/use-toast';
import { Client } from '@/lib/types';
import { generateId } from '@/lib/data';

interface ClientsSectionProps {
  clients: Client[];
  onAddClient: (client: Client) => void;
  onRemoveClient: (clientId: string) => void;
}

export const ClientsSection = ({ clients, onAddClient, onRemoveClient }: ClientsSectionProps) => {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const [newClient, setNewClient] = useState<Partial<Client>>({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
  });
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    client.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editMode && currentClient) {
      setCurrentClient(prev => ({ ...prev, [name]: value } as Client));
    } else {
      setNewClient(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new client
    const client = {
      ...newClient,
      id: generateId('client'),
      createdAt: new Date(),
    } as Client;
    
    onAddClient(client);
    
    // Show success message
    toast({
      title: 'Client added successfully',
      description: `${client.name} has been added to your clients.`,
    });
    
    // Reset form and close dialog
    resetForm();
  };
  
  const handleEditClient = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentClient) {
      // Update client in parent component
      onAddClient(currentClient);
      
      // Show success message
      toast({
        title: 'Client updated successfully',
        description: `${currentClient.name}'s information has been updated.`,
      });
      
      // Reset form and close dialog
      resetForm();
    }
  };
  
  const handleRemoveClient = (clientId: string) => {
    onRemoveClient(clientId);
  };
  
  const openEditDialog = (client: Client) => {
    setCurrentClient(client);
    setEditMode(true);
    setOpen(true);
  };
  
  const resetForm = () => {
    setNewClient({
      name: '',
      email: '',
      phone: '',
      company: '',
      address: '',
    });
    setCurrentClient(null);
    setEditMode(false);
    setOpen(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Clients</h2>
          <p className="text-gray-500">Manage your client relationships</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditMode(false);
              setCurrentClient(null);
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editMode ? 'Edit Client' : 'Add New Client'}</DialogTitle>
              <DialogDescription>
                {editMode ? 'Update the client\'s information below.' : 'Enter the client\'s information below.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={editMode ? handleEditClient : handleAddClient}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input
                    id="name"
                    name="name" 
                    value={editMode && currentClient ? currentClient.name : newClient.name}
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
                    value={editMode && currentClient ? currentClient.email : newClient.email}
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
                    value={editMode && currentClient ? currentClient.phone : newClient.phone}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="company" className="text-right">Company</Label>
                  <Input
                    id="company"
                    name="company"
                    value={editMode && currentClient ? currentClient.company : newClient.company}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="address" className="text-right">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={editMode && currentClient ? currentClient.address : newClient.address}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="photo" className="text-right">Photo</Label>
                  <Input
                    id="photo"
                    name="photo"
                    type="file"
                    accept="image/*"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">
                  {editMode ? 'Update Client' : 'Add Client'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="mb-4 w-full max-w-sm">
        <Input
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client) => (
          <div key={client.id} className="dashboard-card">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{client.name}</h3>
                <p className="text-sm text-gray-500">{client.company}</p>
              </div>
              <div className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full">Client</div>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-gray-400"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                {client.phone}
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-gray-400"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                {client.email}
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-gray-400"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {client.address}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t flex justify-between items-center text-sm text-gray-500">
              <span>Added on {client.createdAt.toLocaleDateString()}</span>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" onClick={() => openEditDialog(client)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                  <span className="ml-1">Edit</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-500 hover:text-red-700 hover:bg-red-50" 
                  onClick={() => handleRemoveClient(client.id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                  <span className="ml-1">Remove</span>
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        {filteredClients.length === 0 && (
          <div className="col-span-3 py-8 text-center">
            <p className="text-gray-500">No clients found. Try adjusting your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientsSection;
