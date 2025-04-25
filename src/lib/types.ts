
export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  createdAt: Date;
};

export type ProjectStatus = 'Active' | 'Working' | 'Closed';

export type Project = {
  id: string;
  name: string;
  clientId: string;
  description: string;
  status: ProjectStatus;
  startDate: Date;
  endDate: Date;
  teamMemberIds: string[];
};

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  joinedDate: Date;
  avatar?: string;
};

export type InternStatus = 'Onboard' | 'Postponed';

export type Intern = {
  id: string;
  name: string;
  email: string;
  phone: string;
  university: string;
  department: string;
  status: InternStatus;
  startDate: Date;
  endDate: Date;
};

export type ContractMilestone = {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  amount: number;
  isCompleted: boolean;
};

export type Contract = {
  id: string;
  title: string;
  clientId: string;
  projectId: string;
  description: string;
  startDate: Date;
  endDate: Date;
  totalValue: number;
  milestones: ContractMilestone[];
};

export type User = {
  id: string;
  username: string;
  password: string;
  name: string;
  role: string;
};
