
import { clients, projects, teamMembers, interns } from '@/lib/data';

export const DashboardStats = () => {
  // Count active projects
  const activeProjects = projects.filter(project => project.status === 'Active').length;
  
  // Count projects by status
  const projectsByStatus = {
    active: projects.filter(project => project.status === 'Active').length,
    working: projects.filter(project => project.status === 'Working').length,
    closed: projects.filter(project => project.status === 'Closed').length,
  };
  
  // Count interns by status
  const internsByStatus = {
    onboard: interns.filter(intern => intern.status === 'Onboard').length,
    postponed: interns.filter(intern => intern.status === 'Postponed').length,
  };

  const stats = [
    {
      name: 'Total Clients',
      value: clients.length,
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Active Projects',
      value: activeProjects,
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>,
      bgColor: 'bg-green-50',
    },
    {
      name: 'Team Members',
      value: teamMembers.length,
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
      bgColor: 'bg-purple-50',
    },
    {
      name: 'Onboarded Interns',
      value: internsByStatus.onboard,
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>,
      bgColor: 'bg-amber-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="dashboard-card flex items-center p-4">
          <div className={`${stat.bgColor} p-3 rounded-lg mr-4`}>
            {stat.icon}
          </div>
          <div>
            <p className="text-sm text-gray-500">{stat.name}</p>
            <p className="text-2xl font-semibold">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
