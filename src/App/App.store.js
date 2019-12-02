import TodoListStore, { info as todoStoreInfo } from './TodoList/TodoList.store';

const AppStore = SubType => class extends SubType {
  getStoreInfo = () => [
    todoStoreInfo,
  ];
};

export default BaseType => [
  TodoListStore,
  AppStore,
  BaseType,
].reduceRight((SuperType, Extend) => Extend(SuperType));
