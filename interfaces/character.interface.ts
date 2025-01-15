export default interface Character {
  id: number;
  name: string;
  description: string;
  tier: string;
  user?: number;
  deleted?: boolean;
}