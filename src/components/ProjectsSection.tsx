
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Project, ProjectStatus, Client, TeamMember } from '@/lib/types';
import { generateId } from '@/lib/data';

interface ProjectsSectionProps {
  projects: Project[];
  clients: Client[];
  teamMembers: TeamMember[];
  onAddProject: (project: Project) => void;
  onRemoveProject: (projectId: string) => void;
}

export const ProjectsSection = ({ 
  projects, 
  clients, 
  teamMembers,
  onAddProject,
  onRemoveProject
}: ProjectsSectionProps) => {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<ProjectStatus>('Active');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newProject, setNewProject] = useState<Partial<Project>>({
    name: '',
    clientId: '',
    description: '',
    status: 'Active',
    teamMemberIds: [],
    startDate: new Date(),
    endDate: new Date(),
  });
  
  const { toast } = useToast();
  
  const filteredProjects = projects
    .filter(project => project.status === activeTab)
    .filter(project => 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editMode && currentProject) {
      setCurrentProject(prev => ({ ...prev, [name]: value } as Project));
    } else {
      setNewProject(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: keyof Project, value: any) => {
    if (editMode && currentProject) {
      setCurrentProject(prev => ({ ...prev, [name]: value } as Project));
    } else {
      setNewProject(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDateChange = (name: string, value: string) => {
    if (editMode && currentProject) {
      setCurrentProject(prev => ({ ...prev, [name]: new Date(value) } as Project));
    } else {
      setNewProject(prev => ({ ...prev, [name]: new Date(value) }));
    }
  };

  const handleSubmitProject = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editMode && currentProject) {
      // Update existing project
      onAddProject(currentProject);
      
      toast({
        title: 'Project updated successfully',
        description: `${currentProject.name} has been updated.`,
      });
    } else {
      // Create new project
      const project = {
        ...newProject,
        id: generateId('project'),
      } as Project;
      
      onAddProject(project);
      
      // Show success message
      toast({
        title: 'Project added successfully',
        description: `${project.name} has been added to your projects.`,
      });
    }
    
    // Reset form and close dialog
    resetForm();
  };
  
  const openEditDialog = (project: Project) => {
    setCurrentProject(project);
    setEditMode(true);
    setOpen(true);
  };
  
  const resetForm = () => {
    setNewProject({
      name: '',
      clientId: '',
      description: '',
      status: 'Active',
      teamMemberIds: [],
      startDate: new Date(),
      endDate: new Date(),
    });
    setCurrentProject(null);
    setEditMode(false);
    setOpen(false);
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };
  
  const getTeamMemberNames = (memberIds: string[]) => {
    return memberIds
      .map(id => teamMembers.find(tm => tm.id === id)?.name || 'Unknown')
      .join(', ');
  };
  
  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Working':
        return 'bg-blue-100 text-blue-800';
      case 'Closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const renderProjectCard = (project: Project) => (
    <div key={project.id} className="dashboard-card">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-lg">{project.name}</h3>
        <div className={`${getStatusColor(project.status)} text-xs px-2.5 py-0.5 rounded-full`}>
          {project.status}
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-1">Client: {getClientName(project.clientId)}</p>
      <p className="mt-3 text-sm">{project.description}</p>
      
      <div className="mt-4 space-y-2 text-sm">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-gray-400"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
          {project.startDate.toLocaleDateString()} - {project.endDate.toLocaleDateString()}
        </div>
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-gray-400"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          {getTeamMemberNames(project.teamMemberIds)}
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t flex justify-between items-center text-sm">
        <Button variant="ghost" size="sm" onClick={() => openEditDialog(project)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
          <span className="ml-1">Edit</span>
        </Button>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            <span className="ml-1">Timeline</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={() => onRemoveProject(project.id)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
            <span className="ml-1">Remove</span>
          </Button>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Projects</h2>
          <p className="text-gray-500">Manage your ongoing projects</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditMode(false);
              setCurrentProject(null);
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editMode ? 'Edit Project' : 'Add New Project'}</DialogTitle>
              <DialogDescription>
                {editMode ? 'Update the project details below.' : 'Enter the project details below.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitProject}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input
                    id="name"
                    name="name" 
                    value={editMode && currentProject ? currentProject.name : newProject.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="clientId" className="text-right">Client</Label>
                  <div className="col-span-3">
                    <Select
                      value={editMode && currentProject ? currentProject.clientId : newProject.clientId}
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
                </div>
                
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="status" className="text-right">Status</Label>
                  <div className="col-span-3">
                    <Select
                      value={editMode && currentProject ? currentProject.status : newProject.status}
                      onValueChange={(value: ProjectStatus) => handleSelectChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Working">Working</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="description" className="text-right">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={editMode && currentProject ? currentProject.description : newProject.description}
                    onChange={handleInputChange}
                    className="col-span-3"
                    rows={3}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="startDate" className="text-right">Start Date</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={editMode && currentProject ? new Date(currentProject.startDate).toISOString().split('T')[0] : 
                      newProject.startDate ? new Date(newProject.startDate).toISOString().split('T')[0] : ''}
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
                    value={editMode && currentProject ? new Date(currentProject.endDate).toISOString().split('T')[0] : 
                      newProject.endDate ? new Date(newProject.endDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => handleDateChange('endDate', e.target.value)}
                    className="col-span-3"
                    required
                  />
                </div>
                
                {/* This is simplified for now - a real implementation would have multi-select */}
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="teamMember" className="text-right">Team Member</Label>
                  <div className="col-span-3">
                    <Select
                      value={editMode && currentProject && currentProject.teamMemberIds.length > 0 ? currentProject.teamMemberIds[0] : 
                        newProject.teamMemberIds?.[0] || ''}
                      onValueChange={(value) => handleSelectChange('teamMemberIds', [value])}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Assign a team member" />
                      </SelectTrigger>
                      <SelectContent>
                        {teamMembers.map(member => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name} - {member.position}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="documents" className="text-right">Documents</Label>
                  <Input
                    id="documents"
                    name="documents"
                    type="file"
                    multiple
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">
                  {editMode ? 'Update Project' : 'Add Project'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="Active" onValueChange={(value) => setActiveTab(value as ProjectStatus)}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="Active">Active</TabsTrigger>
            <TabsTrigger value="Working">Working</TabsTrigger>
            <TabsTrigger value="Closed">Closed</TabsTrigger>
          </TabsList>
          
          <div className="w-64">
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
        
        <TabsContent value="Active" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((project) => renderProjectCard(project))}
            
            {filteredProjects.length === 0 && (
              <div className="col-span-3 py-8 text-center">
                <p className="text-gray-500">No {activeTab.toLowerCase()} projects found. Try adjusting your search or add a new project.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="Working" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((project) => renderProjectCard(project))}
            
            {filteredProjects.length === 0 && (
              <div className="col-span-3 py-8 text-center">
                <p className="text-gray-500">No {activeTab.toLowerCase()} projects found. Try adjusting your search or add a new project.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="Closed" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((project) => renderProjectCard(project))}
            
            {filteredProjects.length === 0 && (
              <div className="col-span-3 py-8 text-center">
                <p className="text-gray-500">No {activeTab.toLowerCase()} projects found. Try adjusting your search or add a new project.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectsSection;
