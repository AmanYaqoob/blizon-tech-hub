
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
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if user is logged in
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
      return;
    }
    
    const lowerTerm = term.toLowerCase();
    
    // Search clients
    const filteredClients = clients.filter(client => 
      client.name.toLowerCase().includes(lowerTerm) || 
      client.company.toLowerCase().includes(lowerTerm) ||
      client.email.toLowerCase().includes(lowerTerm)
    );
    
    // Search projects
    const filteredProjects = projects.filter(project => 
      project.name.toLowerCase().includes(lowerTerm) || 
      project.description.toLowerCase().includes(lowerTerm)
    );
    
    // Search team members
    const filteredTeamMembers = teamMembers.filter(member => 
      member.name.toLowerCase().includes(lowerTerm) || 
      member.position.toLowerCase().includes(lowerTerm) ||
      member.department.toLowerCase().includes(lowerTerm)
    );
    
    // Search interns
    const filteredInterns = interns.filter(intern => 
      intern.name.toLowerCase().includes(lowerTerm) || 
      intern.university.toLowerCase().includes(lowerTerm) ||
      intern.department.toLowerCase().includes(lowerTerm)
    );
    
    // Search contracts
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
    
    // If we have search results, auto-switch to appropriate tab
    if (filteredClients.length > 0) {
      setActiveTab('clients');
    } else if (filteredProjects.length > 0) {
      setActiveTab('projects');
    } else if (filteredTeamMembers.length > 0) {
      setActiveTab('team');
    } else if (filteredInterns.length > 0) {
      setActiveTab('interns');
    } else if (filteredContracts.length > 0) {
      setActiveTab('contracts');
    }
  };
  
  const handleAddClient = (client: Client) => {
    setClients(prev => [client, ...prev]);
  };
  
  const handleAddProject = (project: Project) => {
    setProjects(prev => [project, ...prev]);
  };
  
  const handleAddTeamMember = (teamMember: TeamMember) => {
    setTeamMembers(prev => [teamMember, ...prev]);
  };
  
  const handleAddIntern = (intern: Intern) => {
    setInterns(prev => [intern, ...prev]);
  };
  
  const handleAddContract = (contract: Contract) => {
    setContracts(prev => [contract, ...prev]);
  };
  
  const renderTabContent = () => {
    switch (tab) {
      case 'overview':
        return (
          <div className="space-y-6">
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
          <ClientsSection 
            clients={searchTerm ? searchResults.clients : clients} 
            onAddClient={handleAddClient} 
          />
        );
        
      case 'projects':
        return (
          <ProjectsSection 
            projects={searchTerm ? searchResults.projects : projects}
            clients={clients}
            teamMembers={teamMembers}
            onAddProject={handleAddProject}
          />
        );
        
      case 'team':
        return (
          <TeamSection 
            teamMembers={searchTerm ? searchResults.teamMembers : teamMembers}
            onAddTeamMember={handleAddTeamMember}
          />
        );
        
      case 'interns':
        return (
          <InternsSection 
            interns={searchTerm ? searchResults.interns : interns}
            onAddIntern={handleAddIntern}
          />
        );
        
      case 'calendar':
        return (
          <CalendarView 
            projects={projects}
            contracts={contracts}
          />
        );
        
      case 'contracts':
        return (
          <ContractsSection 
            contracts={searchTerm ? searchResults.contracts : contracts}
            clients={clients}
            projects={projects}
            onAddContract={handleAddContract}
          />
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
