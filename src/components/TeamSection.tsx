
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
import { useToast } from '@/hooks/use-toast';
import { TeamMember } from '@/lib/types';
import { generateId } from '@/lib/data';

interface TeamSectionProps {
  teamMembers: TeamMember[];
  onAddTeamMember: (teamMember: TeamMember) => void;
  onRemoveTeamMember: (teamMemberId: string) => void;
}

export const TeamSection = ({ 
  teamMembers, 
  onAddTeamMember, 
  onRemoveTeamMember 
}: TeamSectionProps) => {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentMember, setCurrentMember] = useState<TeamMember | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newTeamMember, setNewTeamMember] = useState<Partial<TeamMember>>({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    joinedDate: new Date(),
  });
  
  const { toast } = useToast();
  
  const departments = ['Engineering', 'Design', 'Management', 'Marketing', 'Sales', 'Support'];
  
  const filteredTeamMembers = teamMembers.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    member.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editMode && currentMember) {
      setCurrentMember(prev => ({ ...prev, [name]: value } as TeamMember));
    } else {
      setNewTeamMember(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    if (editMode && currentMember) {
      setCurrentMember(prev => ({ ...prev, [name]: value } as TeamMember));
    } else {
      setNewTeamMember(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDateChange = (name: string, value: string) => {
    if (editMode && currentMember) {
      setCurrentMember(prev => ({ ...prev, [name]: new Date(value) } as TeamMember));
    } else {
      setNewTeamMember(prev => ({ ...prev, [name]: new Date(value) }));
    }
  };

  const handleAddTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editMode && currentMember) {
      // Update team member
      onAddTeamMember(currentMember);
      
      toast({
        title: 'Team member updated',
        description: `${currentMember.name}'s information has been updated.`,
      });
    } else {
      // Create new team member
      const teamMember = {
        ...newTeamMember,
        id: generateId('team'),
        joinedDate: newTeamMember.joinedDate || new Date()
      } as TeamMember;
      
      onAddTeamMember(teamMember);
      
      // Show success message
      toast({
        title: 'Team member added successfully',
        description: `${teamMember.name} has been added to your team.`,
      });
    }
    
    // Reset form and close dialog
    resetForm();
  };
  
  const openEditDialog = (member: TeamMember) => {
    setCurrentMember(member);
    setEditMode(true);
    setOpen(true);
  };
  
  const resetForm = () => {
    setNewTeamMember({
      name: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      joinedDate: new Date(),
    });
    setCurrentMember(null);
    setEditMode(false);
    setOpen(false);
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Team Members</h2>
          <p className="text-gray-500">Manage your team</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditMode(false);
              setCurrentMember(null);
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editMode ? 'Edit Team Member' : 'Add New Team Member'}</DialogTitle>
              <DialogDescription>
                {editMode ? 'Update the team member\'s information below.' : 'Enter the team member\'s information below.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddTeamMember}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input
                    id="name"
                    name="name" 
                    value={editMode && currentMember ? currentMember.name : newTeamMember.name}
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
                    value={editMode && currentMember ? currentMember.email : newTeamMember.email}
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
                    value={editMode && currentMember ? currentMember.phone : newTeamMember.phone}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="position" className="text-right">Position</Label>
                  <Input
                    id="position"
                    name="position"
                    value={editMode && currentMember ? currentMember.position : newTeamMember.position}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="department" className="text-right">Department</Label>
                  <div className="col-span-3">
                    <Select
                      value={editMode && currentMember ? currentMember.department : newTeamMember.department}
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
                  <Label htmlFor="joinedDate" className="text-right">Joined Date</Label>
                  <Input
                    id="joinedDate"
                    name="joinedDate"
                    type="date"
                    value={editMode && currentMember ? new Date(currentMember.joinedDate).toISOString().split('T')[0] : 
                      newTeamMember.joinedDate ? new Date(newTeamMember.joinedDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => handleDateChange('joinedDate', e.target.value)}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="resume" className="text-right">Resume</Label>
                  <Input
                    id="resume"
                    name="resume"
                    type="file"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="avatar" className="text-right">Avatar</Label>
                  <Input
                    id="avatar"
                    name="avatar"
                    type="file"
                    accept="image/*"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">
                  {editMode ? 'Update Team Member' : 'Add Team Member'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="mb-4 w-full max-w-sm">
        <Input
          placeholder="Search team members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeamMembers.map((member) => (
          <div key={member.id} className="dashboard-card">
            <div className="flex items-start">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-lg">
                {getInitials(member.name)}
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-sm text-gray-500">{member.position}</p>
                <div className="mt-2 inline-block bg-gray-100 text-gray-800 text-xs px-2.5 py-0.5 rounded-full">
                  {member.department}
                </div>
              </div>
            </div>
            
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-gray-400"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                {member.phone}
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-gray-400"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                {member.email}
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-gray-400"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                Joined {member.joinedDate.toLocaleDateString()}
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t flex justify-between items-center text-sm text-gray-500">
              <Button variant="ghost" size="sm" onClick={() => openEditDialog(member)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                <span className="ml-1">Edit</span>
              </Button>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  <span className="ml-1">Projects</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => onRemoveTeamMember(member.id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                  <span className="ml-1">Remove</span>
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        {filteredTeamMembers.length === 0 && (
          <div className="col-span-3 py-8 text-center">
            <p className="text-gray-500">No team members found. Try adjusting your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamSection;
