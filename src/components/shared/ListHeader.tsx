import { ListHeaderProps } from './types';

export default function ListHeader({ title, addButtonText, onAddItem }: ListHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <button onClick={onAddItem} className="btn1">
        {addButtonText}
      </button>
    </div>
  );
}