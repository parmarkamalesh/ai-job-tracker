import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';

export type JobStatus = 'applied' | 'interviewing' | 'offer' | 'rejected';

export interface JobAttributes {
  id: number;
  userId: number;
  title: string;
  company: string;
  status: JobStatus;
  appliedDate: string | null;
  notes: string | null;
  salary: string | null;
  url: string | null;
}

export type JobCreationAttributes = Optional<JobAttributes, 'id' | 'appliedDate' | 'notes' | 'salary' | 'url'>;

export class Job extends Model<JobAttributes, JobCreationAttributes> implements JobAttributes {
  declare id: number;
  declare userId: number;
  declare title: string;
  declare company: string;
  declare status: JobStatus;
  declare appliedDate: string | null;
  declare notes: string | null;
  declare salary: string | null;
  declare url: string | null;
}

Job.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    company: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('applied', 'interviewing', 'offer', 'rejected'),
      allowNull: false,
      defaultValue: 'applied',
    },
    appliedDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    salary: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    url: {
      type: DataTypes.STRING(2048),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'jobs',
    modelName: 'Job',
  }
);
