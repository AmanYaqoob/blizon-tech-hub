
import { Client, Project, TeamMember, Intern, Contract, User } from './types';

// Admin user
export const users: User[] = [
  {
    id: "user1",
    username: "admin",
    password: "admin",
    name: "Admin User",
    role: "Administrator"
  }
];

// Sample clients
export const clients: Client[] = [
  {
    id: "client1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "555-123-4567",
    company: "Smith Enterprises",
    address: "123 Main St, City, Country",
    createdAt: new Date('2023-01-15')
  },
  {
    id: "client2",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "555-987-6543",
    company: "Johnson Solutions",
    address: "456 Oak Ave, City, Country",
    createdAt: new Date('2023-02-20')
  },
  {
    id: "client3",
    name: "Michael Davis",
    email: "michael.davis@example.com",
    phone: "555-555-5555",
    company: "Davis Technologies",
    address: "789 Pine Blvd, City, Country",
    createdAt: new Date('2023-03-10')
  },
  {
    id: "client4",
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    phone: "555-111-2222",
    company: "Wilson Group",
    address: "321 Elm St, City, Country",
    createdAt: new Date('2023-04-05')
  }
];

// Sample team members
export const teamMembers: TeamMember[] = [
  {
    id: "team1",
    name: "Alex Chen",
    email: "alex.chen@blizon.com",
    phone: "555-222-3333",
    position: "Senior Developer",
    department: "Engineering",
    joinedDate: new Date('2022-06-10')
  },
  {
    id: "team2",
    name: "Maya Singh",
    email: "maya.singh@blizon.com",
    phone: "555-444-5555",
    position: "Project Manager",
    department: "Management",
    joinedDate: new Date('2021-09-15')
  },
  {
    id: "team3",
    name: "David Kim",
    email: "david.kim@blizon.com",
    phone: "555-666-7777",
    position: "UI/UX Designer",
    department: "Design",
    joinedDate: new Date('2022-02-20')
  },
  {
    id: "team4",
    name: "Sophia Martinez",
    email: "sophia.martinez@blizon.com",
    phone: "555-888-9999",
    position: "Backend Developer",
    department: "Engineering",
    joinedDate: new Date('2022-11-05')
  }
];

// Sample projects
export const projects: Project[] = [
  {
    id: "project1",
    name: "E-commerce Website Redesign",
    clientId: "client1",
    description: "Complete redesign of client's e-commerce platform with new features and improved UX",
    status: "Active",
    startDate: new Date('2023-05-01'),
    endDate: new Date('2023-08-15'),
    teamMemberIds: ["team1", "team3"]
  },
  {
    id: "project2",
    name: "Mobile App Development",
    clientId: "client2",
    description: "Creating a native mobile application for iOS and Android platforms",
    status: "Working",
    startDate: new Date('2023-03-10'),
    endDate: new Date('2023-07-20'),
    teamMemberIds: ["team1", "team4"]
  },
  {
    id: "project3",
    name: "CRM Integration",
    clientId: "client3",
    description: "Integration of custom CRM solution with existing client systems",
    status: "Closed",
    startDate: new Date('2023-01-05'),
    endDate: new Date('2023-04-30'),
    teamMemberIds: ["team2", "team4"]
  },
  {
    id: "project4",
    name: "Marketing Dashboard",
    clientId: "client4",
    description: "Analytics dashboard for marketing performance tracking",
    status: "Active",
    startDate: new Date('2023-06-01'),
    endDate: new Date('2023-09-15'),
    teamMemberIds: ["team2", "team3"]
  }
];

// Sample interns
export const interns: Intern[] = [
  {
    id: "intern1",
    name: "Ryan Lee",
    email: "ryan.lee@example.edu",
    phone: "555-123-0001",
    university: "State University",
    department: "Engineering",
    status: "Onboard",
    startDate: new Date('2023-06-01'),
    endDate: new Date('2023-08-31')
  },
  {
    id: "intern2",
    name: "Priya Patel",
    email: "priya.patel@example.edu",
    phone: "555-123-0002",
    university: "Tech Institute",
    department: "Design",
    status: "Onboard",
    startDate: new Date('2023-06-01'),
    endDate: new Date('2023-08-31')
  },
  {
    id: "intern3",
    name: "James Wilson",
    email: "james.wilson@example.edu",
    phone: "555-123-0003",
    university: "City College",
    department: "Marketing",
    status: "Postponed",
    startDate: new Date('2023-09-01'),
    endDate: new Date('2023-11-30')
  }
];

// Sample contracts
export const contracts: Contract[] = [
  {
    id: "contract1",
    title: "E-commerce Platform Development",
    clientId: "client1",
    projectId: "project1",
    description: "Development of a full-featured e-commerce platform with payment processing and inventory management",
    startDate: new Date('2023-05-01'),
    endDate: new Date('2023-08-15'),
    totalValue: 50000,
    milestones: [
      {
        id: "milestone1-1",
        title: "Requirements Gathering and Design",
        description: "Complete all requirements gathering and design mockups",
        dueDate: new Date('2023-05-15'),
        amount: 10000,
        isCompleted: true
      },
      {
        id: "milestone1-2",
        title: "Frontend Development",
        description: "Complete all frontend pages and components",
        dueDate: new Date('2023-06-30'),
        amount: 15000,
        isCompleted: false
      },
      {
        id: "milestone1-3",
        title: "Backend Development and Integration",
        description: "Complete backend services and integration",
        dueDate: new Date('2023-07-30'),
        amount: 15000,
        isCompleted: false
      },
      {
        id: "milestone1-4",
        title: "Testing and Launch",
        description: "Complete testing and launch of the platform",
        dueDate: new Date('2023-08-15'),
        amount: 10000,
        isCompleted: false
      }
    ]
  },
  {
    id: "contract2",
    title: "Mobile Application Development",
    clientId: "client2",
    projectId: "project2",
    description: "Development of a cross-platform mobile application with offline capabilities",
    startDate: new Date('2023-03-10'),
    endDate: new Date('2023-07-20'),
    totalValue: 40000,
    milestones: [
      {
        id: "milestone2-1",
        title: "Design and Prototyping",
        description: "Complete application design and interactive prototype",
        dueDate: new Date('2023-04-10'),
        amount: 8000,
        isCompleted: true
      },
      {
        id: "milestone2-2",
        title: "Core Functionality",
        description: "Develop core application functionality",
        dueDate: new Date('2023-05-20'),
        amount: 12000,
        isCompleted: true
      },
      {
        id: "milestone2-3",
        title: "Additional Features and API Integration",
        description: "Implement additional features and API integration",
        dueDate: new Date('2023-06-30'),
        amount: 12000,
        isCompleted: false
      },
      {
        id: "milestone2-4",
        title: "Testing and App Store Submission",
        description: "Complete testing and submit to app stores",
        dueDate: new Date('2023-07-20'),
        amount: 8000,
        isCompleted: false
      }
    ]
  }
];

// Function to get client name by ID
export const getClientById = (id: string) => {
  return clients.find(client => client.id === id);
};

// Function to get team member name by ID
export const getTeamMemberById = (id: string) => {
  return teamMembers.find(member => member.id === id);
};

// Function to get project by ID
export const getProjectById = (id: string) => {
  return projects.find(project => project.id === id);
};

// Helper function to generate ID
export const generateId = (prefix: string) => {
  return `${prefix}${Math.random().toString(36).substr(2, 9)}`;
};
