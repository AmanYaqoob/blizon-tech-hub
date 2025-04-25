
import { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Project, Contract, ContractMilestone } from '@/lib/types';
import { getClientById } from '@/lib/data';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';

interface CalendarViewProps {
  projects: Project[];
  contracts: Contract[];
}

interface CalendarEvent {
  date: Date;
  title: string;
  description: string;
  type: 'project' | 'milestone';
}

export const CalendarView = ({ projects, contracts }: CalendarViewProps) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedEvents, setSelectedEvents] = useState<CalendarEvent[]>([]);
  
  useEffect(() => {
    const projectEvents: CalendarEvent[] = projects.map(project => ({
      date: new Date(project.endDate),
      title: `Project Deadline: ${project.name}`,
      description: `${project.description}`,
      type: 'project',
    }));
    
    const milestoneEvents: CalendarEvent[] = contracts.flatMap(contract => 
      contract.milestones.map(milestone => ({
        date: new Date(milestone.dueDate),
        title: `Milestone: ${milestone.title}`,
        description: `${contract.title} - ${milestone.description}`,
        type: 'milestone',
      }))
    );
    
    setEvents([...projectEvents, ...milestoneEvents]);
  }, [projects, contracts]);
  
  useEffect(() => {
    if (selectedDate) {
      const eventsOnSelectedDate = events.filter(
        event => 
          event.date.getDate() === selectedDate.getDate() &&
          event.date.getMonth() === selectedDate.getMonth() &&
          event.date.getFullYear() === selectedDate.getFullYear()
      );
      setSelectedEvents(eventsOnSelectedDate);
    } else {
      setSelectedEvents([]);
    }
  }, [selectedDate, events]);
  
  // Helper function to check if a date has any events
  const hasEventOnDate = (date: Date) => {
    return events.some(
      event => 
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Calendar</h2>
        <p className="text-gray-500">Project deadlines and milestones</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
        <div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="dashboard-card pointer-events-auto"
            modifiers={{
              event: (date) => hasEventOnDate(date),
            }}
            modifiersClassNames={{
              event: 'border-primary bg-primary/10 font-medium',
            }}
          />
        </div>
        
        <div className="dashboard-card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              Events for {selectedDate?.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </h3>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
                  Add Event
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="p-2">
                  <p>Event creation coming soon</p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          {selectedEvents.length > 0 ? (
            <div className="space-y-4">
              {selectedEvents.map((event, index) => (
                <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <h4 className="text-base font-medium">{event.title}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      event.type === 'project' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {event.type === 'project' ? 'Project' : 'Milestone'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                  <p className="text-xs text-gray-400 mt-2">{event.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-300 mb-4"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
              <p className="text-gray-500">No events for this date</p>
              <Button variant="link" className="mt-2">
                Add an event
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
