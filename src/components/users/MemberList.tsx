// import { useState } from 'react';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '../shared/Tabs';
// import ListView from '../shared/ListView';
// import InviteUserForm from './InviteUserForm';
// import { ListConfig } from '../shared/types';
// import { Mail, Shield } from 'lucide-react';
// import { users } from '../../mockData/userData';
// import { mockInvitations } from '../../mockData/inviteData';


// const userConfig: ListConfig = {
//   title: 'Users',
//   addButtonText: 'Invite User',
//   searchPlaceholder: 'Search users...',
//   itemsName: 'users',
//   showStatus: true,
//   statusOptions: ['active', 'inactive'],
//   sortOptions: [
//     { key: 'name', label: 'Name' },
//     { key: 'role', label: 'Role' },
//     { key: 'lastLogin', label: 'Last Login' }
//   ]
// };


// const inviteConfig: ListConfig = {
//   title: 'Invites',
//   addButtonText: 'Invite User',
//   searchPlaceholder: 'Search invites...',
//   itemsName: 'users',
//   showStatus: true,
//   statusOptions: ['pending', 'accepted', 'expired'],
//   sortOptions: [
//     { key: 'name', label: 'Name' },
//     { key: 'status', label: 'Status' },
//   ]
// };


// interface UserListProps {
//   onUserView?: (id: number) => void;
//   defaultView?: 'grid' | 'list';
// }

// export default function UserList({
//   onUserView = () => { },
//   defaultView = 'grid'
// }: UserListProps) {
//   const [activeTab, setActiveTab] = useState('users');
//   const [isInviteFormOpen, setIsInviteFormOpen] = useState(false);

//   const handleAddItem = () => {
//     if (activeTab === 'users') {
//       setIsInviteFormOpen(true);
//     }
//   };

//   return (
//     <div className="py-4 px-4 mt-2">
//       <div className="max-w-8xl mx-auto">
//         <Tabs value={activeTab} onValueChange={setActiveTab}>
//           <div className="flex justify-center items-center">
//             <TabsList>
//               <TabsTrigger value="users" className="flex items-center gap-2">
//                 <Shield className="h-4 w-4" />
//                 Users
//               </TabsTrigger>
//               <TabsTrigger value="invitations" className="flex items-center gap-2">
//                 <Mail className="h-4 w-4" />
//                 Invitations
//               </TabsTrigger>
//             </TabsList>
//           </div>

//           <TabsContent value="users">
//             <ListView
//               items={users}
//               config={userConfig}
//               onItemView={onUserView}
//               onAddItem={handleAddItem}
//               defaultView={defaultView}
//             />
//           </TabsContent>

//           <TabsContent value="invitations">
//             <ListView
//               items={mockInvitations}
//               config={inviteConfig}
//               onItemView={onUserView}
//               onAddItem={handleAddItem}
//             />
//           </TabsContent>
//         </Tabs>

//         <InviteUserForm
//           isOpen={isInviteFormOpen}
//           onClose={() => setIsInviteFormOpen(false)}
//         />
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import ListView from '../shared/ListView';
import InviteUserForm from './InviteUserForm';
import { ListConfig } from '../shared/types';
// import { users } from '../../mockData/userData';
import { UserItem } from '../../types';
import { getUserId } from '../../utils/storage';
import { API_URL } from '../../data';
import { Ban, CheckCircle2, Unlink } from 'lucide-react';

const userConfig: ListConfig = {
    title: 'Users',
    addButtonText: 'Add Member',
    searchPlaceholder: 'Search users...',
    itemsName: 'users',
    showStatus: true,
    showRole: true,
    showMember: true,
    statusOptions: ['active', 'inactive'],
    sortOptions: [
        { key: 'name', label: 'Name' },
        { key: 'role', label: 'Role' },
        { key: 'lastLogin', label: 'Last Login' }
    ],
    bulkActions : [
          { label: 'Activate', action: 'activate', icon: <CheckCircle2  className="h-4 w-4" /> },
          { label: 'Deactivate', action: 'deactivate', icon: <Ban  className="h-4 w-4" /> },
          { label: 'Delink', action: 'delink', icon: <Unlink className='h-4 w-4' />}
        ]
};

interface MemberListProps {
    onUserView?: (id: number) => void;
    defaultView?: 'grid' | 'list';
    projId: number
}

export default function MemberList({
    onUserView = () => { },
    defaultView = 'grid',
    projId = -1
}: MemberListProps) {

    const [isInviteFormOpen, setIsInviteFormOpen] = useState(false);
    const [users, setUsers] = useState<UserItem[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = getUserId();
                if (!userId) {
                    console.warn("User ID is missing");
                    return;
                }

                if (projId < 0) {
                    console.log("Proj ID :", projId)
                    console.warn("Invalid Project ID");
                    return;
                }
                
                var url = `${API_URL}/getUsersByPrj/${projId}`

                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }

                const data = await response.json();
                // console.log("Users Response:", data.data);

                  if (data?.data.users && Array.isArray(data.data.users)) {
                    const convertedUsers: UserItem[] = data.data.users.map((user: any) => ({
                      id: user.userId,
                      name: user.firstName + " " + user.lastName,
                      email: user.email,
                      update_seq_no: user.updateSeqNo,
                      role: 'admin',
                      status: 'active',
                      position: "",
                      lastLogin: ""
                    }));

                    setUsers(convertedUsers);
                  } else {
                    console.warn("Invalid response structure:", data);
                  }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const handleAddItem = () => {
        setIsInviteFormOpen(true);
    };

    return (
        <div className="mt-2">
            <div className="max-w-8xl mx-auto">
                <ListView
                    items={users}
                    config={userConfig}
                    onItemView={onUserView}
                    onAddItem={handleAddItem}
                    defaultView={defaultView}
                    projectId={projId}      
                />
                <InviteUserForm
                    isOpen={isInviteFormOpen}
                    onClose={() => setIsInviteFormOpen(false)}
                />
            </div>
        </div>
    );
}