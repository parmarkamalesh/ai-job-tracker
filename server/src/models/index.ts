import { User } from './userModel';
import { Job } from './jobModel';

User.hasMany(Job, { foreignKey: 'userId', as: 'jobs' });
Job.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export { User, Job };
