import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Components
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import DashboardStats from '@/components/DashboardStats';
import ClientsSection from '@/components/ClientsSection';
import ProjectsSection from '@/components/ProjectsSection';
import TeamSection from '@/components/TeamSection';
import InternsSection from '@/components/InternsSection';
import CalendarView from '@/components/CalendarView';
import ContractsSection from '@/components/ContractsSection';
import { SearchBar } from '@/components/SearchBar';
import { Button } from '@/components/ui/button';

// Data and types
import { 
  clients as initialClients, 
  projects as initialProjects,
  teamMembers as initialTeamMembers,
  interns as initialInterns,
  contracts as initialContracts
} from '@/lib/data';
import { Client, Project, TeamMember, Intern, Contract } from '@/lib/types';

type Tab = 'overview' | 'clients' | 'projects' | 'team' | 'interns' | 'calendar' | 'contracts';

const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') as Tab || 'overview';
  
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [interns, setInterns] = useState<Intern[]>(initialInterns);
  const [contracts, setContracts] = useState<Contract[]>(initialContracts);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<{
    clients: Client[],
    projects: Project[],
    teamMembers: TeamMember[],
    interns: Intern[],
    contracts: Contract[],
  }>({
    clients: [],
    projects: [],
    teamMembers: [],
    interns: [],
    contracts: [],
  });
  
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const user = sessionStorage.getItem('user');
    if (!user) {
      navigate('/');
      toast({
        title: 'Authentication required',
        description: 'Please log in to access the dashboard',
        variant: 'destructive',
      });
    }
  }, [navigate, toast]);
  
  const setActiveTab = (tab: Tab) => {
    setSearchParams({ tab });
  };
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    
    if (!term.trim()) {
      setSearchResults({
        clients: [],
        projects: [],
        teamMembers: [],
        interns: [],
        contracts: [],
      });
      setShowSearchResults(false);
      return;
    }
    
    setShowSearchResults(true);
    const lowerTerm = term.toLowerCase();
    
    const filteredClients = clients.filter(client => 
      client.name.toLowerCase().includes(lowerTerm) || 
      client.company.toLowerCase().includes(lowerTerm) ||
      client.email.toLowerCase().includes(lowerTerm)
    );
    
    const filteredProjects = projects.filter(project => 
      project.name.toLowerCase().includes(lowerTerm) || 
      project.description.toLowerCase().includes(lowerTerm)
    );
    
    const filteredTeamMembers = teamMembers.filter(member => 
      member.name.toLowerCase().includes(lowerTerm) || 
      member.position.toLowerCase().includes(lowerTerm) ||
      member.department.toLowerCase().includes(lowerTerm)
    );
    
    const filteredInterns = interns.filter(intern => 
      intern.name.toLowerCase().includes(lowerTerm) || 
      intern.university.toLowerCase().includes(lowerTerm) ||
      intern.department.toLowerCase().includes(lowerTerm)
    );
    
    const filteredContracts = contracts.filter(contract => 
      contract.title.toLowerCase().includes(lowerTerm) || 
      contract.description.toLowerCase().includes(lowerTerm)
    );
    
    setSearchResults({
      clients: filteredClients,
      projects: filteredProjects,
      teamMembers: filteredTeamMembers,
      interns: filteredInterns,
      contracts: filteredContracts,
    });
    
    if (filteredClients.length > 0 && tab !== 'clients') {
      setActiveTab('clients');
    } else if (filteredProjects.length > 0 && tab !== 'projects') {
      setActiveTab('projects');
    } else if (filteredTeamMembers.length > 0 && tab !== 'team') {
      setActiveTab('team');
    } else if (filteredInterns.length > 0 && tab !== 'interns') {
      setActiveTab('interns');
    } else if (filteredContracts.length > 0 && tab !== 'contracts') {
      setActiveTab('contracts');
    }
  };
  
  const handleAddClient = (client: Client) => {
    setClients(prev => {
      const index = prev.findIndex(c => c.id === client.id);
      if (index !== -1) {
        const updatedClients = [...prev];
        updatedClients[index] = client;
        return updatedClients;
      } else {
        return [client, ...prev];
      }
    });
  };
  
  const handleRemoveClient = (clientId: string) => {
    setClients(prev => prev.filter(client => client.id !== clientId));
    toast({
      title: 'Client removed',
      description: 'The client has been removed from your list',
    });
  };
  
  const handleAddProject = (project: Project) => {
    setProjects(prev => {
      const index = prev.findIndex(p => p.id === project.id);
      if (index !== -1) {
        const updatedProjects = [...prev];
        updatedProjects[index] = project;
        return updatedProjects;
      } else {
        return [project, ...prev];
      }
    });
  };
  
  const handleRemoveProject = (projectId: string) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
    toast({
      title: 'Project removed',
      description: 'The project has been removed from your list',
    });
  };
  
  const handleAddTeamMember = (teamMember: TeamMember) => {
    setTeamMembers(prev => {
      const index = prev.findIndex(t => t.id === teamMember.id);
      if (index !== -1) {
        const updatedTeam = [...prev];
        updatedTeam[index] = teamMember;
        return updatedTeam;
      } else {
        return [teamMember, ...prev];
      }
    });
  };
  
  const handleAddIntern = (intern: Intern) => {
    setInterns(prev => {
      const index = prev.findIndex(i => i.id === intern.id);
      if (index !== -1) {
        const updatedInterns = [...prev];
        updatedInterns[index] = intern;
        return updatedInterns;
      } else {
        return [intern, ...prev];
      }
    });
  };
  
  const handleAddContract = (contract: Contract) => {
    setContracts(prev => {
      const index = prev.findIndex(c => c.id === contract.id);
      if (index !== -1) {
        const updatedContracts = [...prev];
        updatedContracts[index] = contract;
        return updatedContracts;
      } else {
        return [contract, ...prev];
      }
    });
  };
  
  const handleRemoveTeamMember = (teamMemberId: string) => {
    setTeamMembers(prev => prev.filter(member => member.id !== teamMemberId));
    toast({
      title: 'Team member removed',
      description: 'The team member has been removed from your list',
    });
  };
  
  const handleRemoveIntern = (internId: string) => {
    setInterns(prev => prev.filter(intern => intern.id !== internId));
    toast({
      title: 'Intern removed',
      description: 'The intern has been removed from your list',
    });
  };
  
  const handleRemoveContract = (contractId: string) => {
    setContracts(prev => prev.filter(contract => contract.id !== contractId));
    toast({
      title: 'Contract removed',
      description: 'The contract has been removed from your list',
    });
  };
  
  const renderSearchResults = () => {
    if (!showSearchResults || !searchTerm) return null;
    
    const hasResults = 
      searchResults.clients.length > 0 || 
      searchResults.projects.length > 0 || 
      searchResults.teamMembers.length > 0 || 
      searchResults.interns.length > 0 || 
      searchResults.contracts.length > 0;
    
    if (!hasResults) {
      return (
        <div className="mb-6 p-6 bg-white rounded-lg shadow-sm">
          <p className="text-center text-gray-500">No results found for "{searchTerm}"</p>
        </div>
      );
    }
    
    return (
      <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Search Results for "{searchTerm}"</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              setSearchTerm('');
              setShowSearchResults(false);
            }}
          >
            Clear Search
          </Button>
        </div>
        
        <div className="space-y-4">
          {searchResults.clients.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Clients</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {searchResults.clients.slice(0, 4).map(client => (
                  <div key={client.id} className="p-3 border rounded-md hover:bg-gray-50">
                    <div className="font-medium">{client.name}</div>
                    <div className="text-sm text-gray-500">{client.company}</div>
                  </div>
                ))}
              </div>
              {searchResults.clients.length > 4 && (
                <Button 
                  variant="link" 
                  size="sm"
                  onClick={() => setActiveTab('clients')}
                >
                  View all {searchResults.clients.length} clients
                </Button>
              )}
            </div>
          )}
          
          {searchResults.projects.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Projects</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {searchResults.projects.slice(0, 4).map(project => (
                  <div key={project.id} className="p-3 border rounded-md hover:bg-gray-50">
                    <div className="font-medium">{project.name}</div>
                    <div className="text-sm text-gray-500">{project.description.slice(0, 50)}...</div>
                  </div>
                ))}
              </div>
              {searchResults.projects.length > 4 && (
                <Button 
                  variant="link" 
                  size="sm"
                  onClick={() => setActiveTab('projects')}
                >
                  View all {searchResults.projects.length} projects
                </Button>
              )}
            </div>
          )}
          
          {searchResults.teamMembers.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Team Members</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {searchResults.teamMembers.slice(0, 4).map(member => (
                  <div key={member.id} className="p-3 border rounded-md hover:bg-gray-50">
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-gray-500">{member.position}</div>
                  </div>
                ))}
              </div>
              {searchResults.teamMembers.length > 4 && (
                <Button 
                  variant="link" 
                  size="sm"
                  onClick={() => setActiveTab('team')}
                >
                  View all {searchResults.teamMembers.length} team members
                </Button>
              )}
            </div>
          )}
          
          {searchResults.interns.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Interns</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {searchResults.interns.slice(0, 4).map(intern => (
                  <div key={intern.id} className="p-3 border rounded-md hover:bg-gray-50">
                    <div className="font-medium">{intern.name}</div>
                    <div className="text-sm text-gray-500">{intern.university}</div>
                  </div>
                ))}
              </div>
              {searchResults.interns.length > 4 && (
                <Button 
                  variant="link" 
                  size="sm"
                  onClick={() => setActiveTab('interns')}
                >
                  View all {searchResults.interns.length} interns
                </Button>
              )}
            </div>
          )}
          
          {searchResults.contracts.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Contracts</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {searchResults.contracts.slice(0, 4).map(contract => (
                  <div key={contract.id} className="p-3 border rounded-md hover:bg-gray-50">
                    <div className="font-medium">{contract.title}</div>
                    <div className="text-sm text-gray-500">{contract.description.slice(0, 50)}...</div>
                  </div>
                ))}
              </div>
              {searchResults.contracts.length > 4 && (
                <Button 
                  variant="link" 
                  size="sm"
                  onClick={() => setActiveTab('contracts')}
                >
                  View all {searchResults.contracts.length} contracts
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  const renderTabContent = () => {
    switch (tab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {renderSearchResults()}
            <DashboardStats />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="dashboard-card">
                <h3 className="section-title">Recent Projects</h3>
                <div className="space-y-3">
                  {projects.slice(0, 3).map((project) => (
                    <div key={project.id} className="flex justify-between p-2 hover:bg-gray-50 rounded-md">
                      <div>
                        <p className="font-medium">{project.name}</p>
                        <p className="text-sm text-gray-500">{project.description.slice(0, 60)}...</p>
                      </div>
                      <div className={`self-center text-xs px-2 py-1 rounded-full ${
                        project.status === 'Active' ? 'bg-green-100 text-green-800' :
                        project.status === 'Working' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {project.status}
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  className="text-primary text-sm mt-4 flex items-center"
                  onClick={() => setActiveTab('projects')}
                >
                  View all projects
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              </div>
              
              <div className="dashboard-card">
                <h3 className="section-title">Latest Contracts</h3>
                <div className="space-y-3">
                  {contracts.slice(0, 2).map((contract) => (
                    <div key={contract.id} className="flex justify-between p-2 hover:bg-gray-50 rounded-md">
                      <div>
                        <p className="font-medium">{contract.title}</p>
                        <p className="text-sm text-gray-500">{contract.description.slice(0, 60)}...</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                            {new Date(contract.startDate).toLocaleDateString()} - {new Date(contract.endDate).toLocaleDateString()}
                          </span>
                          <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                            ${contract.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  className="text-primary text-sm mt-4 flex items-center"
                  onClick={() => setActiveTab('contracts')}
                >
                  View all contracts
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              </div>
            </div>
            
            <div className="dashboard-card">
              <h3 className="section-title">Upcoming Deadlines</h3>
              <div className="space-y-3">
                {projects
                  .filter(project => project.status === 'Active' || project.status === 'Working')
                  .sort((a, b) => a.endDate.getTime() - b.endDate.getTime())
                  .slice(0, 4)
                  .map((project) => (
                    <div key={project.id} className="flex justify-between p-2 hover:bg-gray-50 rounded-md">
                      <div>
                        <p className="font-medium">{project.name}</p>
                        <p className="text-sm text-gray-500">{project.description.slice(0, 60)}...</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Deadline</p>
                        <p className="text-sm">{project.endDate.toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
              </div>
              <button 
                className="text-primary text-sm mt-4 flex items-center"
                onClick={() => setActiveTab('calendar')}
              >
                View calendar
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
          </div>
        );
        
      case 'clients':
        return (
          <>
            {renderSearchResults()}
            <ClientsSection 
              clients={searchTerm && showSearchResults ? searchResults.clients : clients} 
              onAddClient={handleAddClient}
              onRemoveClient={handleRemoveClient}
            />
          </>
        );
        
      case 'projects':
        return (
          <>
            {renderSearchResults()}
            <ProjectsSection 
              projects={searchTerm && showSearchResults ? searchResults.projects : projects}
              clients={clients}
              teamMembers={teamMembers}
              onAddProject={handleAddProject}
              onRemoveProject={handleRemoveProject}
            />
          </>
        );
        
      case 'team':
        return (
          <>
            {renderSearchResults()}
            <TeamSection 
              teamMembers={searchTerm && showSearchResults ? searchResults.teamMembers : teamMembers}
              onAddTeamMember={handleAddTeamMember}
              onRemoveTeamMember={handleRemoveTeamMember}
            />
          </>
        );
        
      case 'interns':
        return (
          <>
            {renderSearchResults()}
            <InternsSection 
              interns={searchTerm && showSearchResults ? searchResults.interns : interns}
              onAddIntern={handleAddIntern}
              onRemoveIntern={handleRemoveIntern}
            />
          </>
        );
        
      case 'calendar':
        return (
          <>
            {renderSearchResults()}
            <CalendarView 
              projects={projects}
              contracts={contracts}
            />
          </>
        );
        
      case 'contracts':
        return (
          <>
            {renderSearchResults()}
            <ContractsSection 
              contracts={searchTerm && showSearchResults ? searchResults.contracts : contracts}
              clients={clients}
              projects={projects}
              onAddContract={handleAddContract}
              onRemoveContract={handleRemoveContract}
            />
          </>
        );
        
      default:
        return <div>Select a tab</div>;
    }
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onSearch={handleSearch} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
