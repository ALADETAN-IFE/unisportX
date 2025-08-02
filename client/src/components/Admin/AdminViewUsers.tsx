import { useState } from 'react';
import type { UserData } from '../../interface';
import { getFacultyColor } from '../../utils/datas';

interface AdminViewUsersProps {
    user: UserData;
    deleteUser: (userId: string) => void;
    formatDate: (dateString: string) => string;
    toggleUserStatus: (userId: string, isActive: boolean) => void;
}

const AdminViewUsers = ({ user, deleteUser, formatDate, toggleUserStatus }: AdminViewUsersProps) => {
    const [isChangingStatus, setIsChangingStatus] = useState<string>("");


    const handleDeactivate = async ({userId, isActive}: {userId: string, isActive: boolean}) => {
        if(isActive){
            setIsChangingStatus("Deactivating...") 
        } else{
            setIsChangingStatus("Activating...")
        }
        try {
            await toggleUserStatus(userId, isActive);
        } catch (err) {
            console.error('Failed to change user status', err);
        } finally {
            setIsChangingStatus("");
        }
    }

    return(
        <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
        <td className="px-6 py-4 whitespace-nowrap">
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {user.username || 'N/A'}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {user.email}
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getFacultyColor(user.faculty || 'Other')}`}> 
            {user.faculty || 'N/A'}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
          {user.role || 'User'}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            user.isActive 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {user.isActive ? 'Active' : 'Inactive'}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            user.isVerified
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
          }`}>
            {user.isVerified ? 'Yes' : 'No'}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
          {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div className="flex gap-2">
            <button
              onClick={() => handleDeactivate({userId: user._id, isActive: user.isActive || false})}
              className={`px-2 py-1 rounded text-xs ${
                user.isActive
                  ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
                {
                    isChangingStatus ? isChangingStatus
                    : 
                    user.isActive ? 'Deactivate' : 'Activate'
                }
            </button>
            <button
              onClick={() => deleteUser(user._id)}
              className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </td>
      </tr>
    )
}

export default AdminViewUsers