const statuses: string[] = ['confirmed', 'en-route', 'delivered', 'cancelled'];

export const statusColors: { [key: string]: string } = {
  confirmed: 'blue',
  success: 'green',
  'en-route': 'orange',
  delivered: 'green',
  cancelled: 'gray',
  error: 'red',
  failed: 'red',
};

export default statuses;
