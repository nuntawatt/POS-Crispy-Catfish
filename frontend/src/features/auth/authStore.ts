import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Role } from '../../shared/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loginAs: (role: Role, name?: string) => void;
  logout: () => void;
}

const DEFAULT_USERS: Record<Role, User> = {
  customer: {
    id: 'usr-customer-1',
    email: 'customer@example.com',
    fullName: 'คุณลูกค้าทั่วไป',
    role: 'customer',
  },
  staff: {
    id: 'usr-staff-1',
    email: 'cashier@crispycatfish.com',
    fullName: 'พนักงานหน้าร้าน / แคชเชียร์',
    role: 'staff',
  },
  admin: {
    id: 'usr-admin-1',
    email: 'owner@crispycatfish.com',
    fullName: 'ผู้จัดการร้าน (Admin)',
    role: 'admin',
  },
  rider: {
    id: 'usr-rider-1',
    email: 'rider@crispycatfish.com',
    fullName: 'สมคิด ไรเดอร์ส่งด่วน',
    role: 'rider',
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: DEFAULT_USERS.customer,
      isAuthenticated: true,

      loginAs: (role, name) => {
        const base = DEFAULT_USERS[role];
        set({
          user: {
            ...base,
            fullName: name || base.fullName,
          },
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'pos_crispy_catfish_auth',
    }
  )
);
