import { useState } from 'react';
import ListView from '../shared/ListView';
import AddApplicationForm from './AddApplicationForm';
import { ListConfig } from '../shared/types';
import { applications } from '../../mockData/appData';


const applicationConfig: ListConfig = {
  title: 'Applications',
  addButtonText: 'Add Application',
  searchPlaceholder: 'Search applications...',
  itemsName: 'applications',
  showType: true,
  sortOptions: [
    { key: 'name', label: 'Name' },
    { key: 'type', label: 'Type' },
    { key: 'lastUpdated', label: 'Last Updated' }
  ]
};


interface ApplicationListProps {
  projectId: number
  onApplicationView?: (id: number) => void;
  defaultView?: 'grid' | 'list';
}
export default function ApplicationList({
  projectId = -1,
  onApplicationView = () => { },
  defaultView = 'grid'
}: ApplicationListProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <>
      <ListView
        items={applications}
        config={applicationConfig}
        onItemView={onApplicationView}
        onAddItem={() => setIsFormOpen(true)}
        defaultView={defaultView}
        projectId={projectId}
      />
      <AddApplicationForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </>
  );
}