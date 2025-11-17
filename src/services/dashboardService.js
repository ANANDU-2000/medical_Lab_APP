// Dashboard Data Service
import { getPatients } from '../features/shared/dataService';
import { getUsers } from './authService';

/**
 * Get dashboard data for Admin
 */
export const getAdminDashboardData = () => {
  const patients = getPatients();
  const users = getUsers();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Filter today's patients
  const patientsToday = patients.filter(p => {
    const createdDate = new Date(p.createdAt);
    return createdDate >= today && createdDate < tomorrow;
  });

  // Filter this month's patients
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const patientsThisMonth = patients.filter(p => {
    const createdDate = new Date(p.createdAt);
    return createdDate >= thisMonth && createdDate < nextMonth;
  });

  // Calculate revenue and profit
  const calculatePatientRevenue = (patient) => {
    if (!patient.visits || patient.visits.length === 0) return 0;
    const latestVisit = patient.visits[patient.visits.length - 1];
    return latestVisit.finalAmount || 0;
  };

  const revenueThisMonth = patientsThisMonth.reduce((sum, p) => sum + calculatePatientRevenue(p), 0);
  const expensesThisMonth = revenueThisMonth * 0.4; // Assume 40% expenses
  const profitThisMonth = revenueThisMonth - expensesThisMonth;

  const revenueToday = patientsToday.reduce((sum, p) => sum + calculatePatientRevenue(p), 0);
  const expensesToday = revenueToday * 0.4;
  const profitToday = revenueToday - expensesToday;

  // Get last 7 days revenue/expenses
  const revenue7days = [];
  const expenses7days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    const dayPatients = patients.filter(p => {
      const createdDate = new Date(p.createdAt);
      return createdDate >= date && createdDate < nextDay;
    });

    const dayRevenue = dayPatients.reduce((sum, p) => sum + calculatePatientRevenue(p), 0);
    revenue7days.push({
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      value: dayRevenue
    });
    expenses7days.push({
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      value: dayRevenue * 0.4
    });
  }

  // Get staff activity
  const staffUsers = users.filter(u => u.role === 'staff' && u.isActive);
  const staffActivity = staffUsers.map(staff => {
    const staffPatientsToday = patientsToday.filter(p => p.created_by_user_id === staff.userId);
    const staffReportsToday = patients.filter(p => {
      if (!p.visits || p.visits.length === 0) return false;
      return p.visits.some(v => {
        const reportDate = v.reportedAt ? new Date(v.reportedAt) : null;
        return reportDate && reportDate >= today && reportDate < tomorrow && v.result_entered_by_user_id === staff.userId;
      });
    });

    return {
      staffName: staff.fullName,
      patientsHandled: staffPatientsToday.length,
      reportsGenerated: staffReportsToday.length
    };
  });

  // Get today's patients list with status
  const patientsListToday = patientsToday.map(patient => {
    let status = 'Registered';
    let visitId = null;

    if (patient.visits && patient.visits.length > 0) {
      const latestVisit = patient.visits[patient.visits.length - 1];
      visitId = latestVisit.visitId;

      if (latestVisit.reportedAt) {
        status = 'Completed';
      } else if (latestVisit.tests && latestVisit.tests.some(t => t.value)) {
        status = 'Result Pending';
      } else {
        status = 'Result Pending';
      }
    }

    return {
      ...patient,
      status,
      visitId
    };
  });

  return {
    patientsToday: patientsToday.length,
    totalPatientsMonth: patientsThisMonth.length,
    revenueMonth: revenueThisMonth,
    profitMonth: profitThisMonth,
    revenueToday,
    expensesToday,
    profitToday,
    patientsListToday,
    staffActivity,
    revenue7days,
    expenses7days
  };
};

/**
 * Get dashboard data for Staff
 */
export const getStaffDashboardData = (userId) => {
  const patients = getPatients();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Filter today's patients
  const patientsToday = patients.filter(p => {
    const createdDate = new Date(p.createdAt);
    return createdDate >= today && createdDate < tomorrow;
  });

  // Filter pending patients (those without results)
  const pendingPatients = patients.filter(p => {
    if (!p.visits || p.visits.length === 0) return true;
    const latestVisit = p.visits[p.visits.length - 1];
    return !latestVisit.reportedAt;
  });

  // Get today's patients list
  const patientsListToday = patientsToday.map(patient => {
    let status = 'Registered';
    let visitId = null;

    if (patient.visits && patient.visits.length > 0) {
      const latestVisit = patient.visits[patient.visits.length - 1];
      visitId = latestVisit.visitId;

      if (latestVisit.reportedAt) {
        status = 'Completed';
      } else if (latestVisit.tests && latestVisit.tests.some(t => t.value)) {
        status = 'Result Pending';
      } else {
        status = 'Result Pending';
      }
    }

    return {
      ...patient,
      status,
      visitId
    };
  });

  return {
    patientsToday: patientsToday.length,
    pendingPatients: pendingPatients.length,
    patientsListToday
  };
};
