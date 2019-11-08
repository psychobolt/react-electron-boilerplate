import TodoListStore from './TodoList/TodoList.store';

export default BaseType => [
  TodoListStore,
  BaseType,
].reduceRight((SuperType, Extend) => Extend(SuperType));
