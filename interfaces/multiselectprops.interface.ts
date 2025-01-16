export default interface MultiSelectProps<T extends number> {
  title: string;
  items: T[];
  selected: T[];
  onSelectionChange: (selected: T[]) => void;
  getDisplayName: (value: T) => string;
}
