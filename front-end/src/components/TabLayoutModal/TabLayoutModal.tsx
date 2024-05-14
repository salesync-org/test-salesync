import useAuth from '@/hooks/useAuth';
import { Button, DropDown, DropDownItem, Icon, Item, Modal, PrimaryButton, TextInput } from '../ui';
import { useState } from 'react';
import { cn } from '@/utils/utils';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import { StrictModeDroppable } from '../ui/StrictModeDroppable';
import { Check, GripVertical, Minus, Plus, X } from 'lucide-react';
import useType from '@/hooks/type-service/useType';

type TabLayoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  layoutName?: string;
  className?: string;
};

const TabLayoutModal = ({ isOpen, onClose, layoutName, ...props }: TabLayoutModalProps) => {
  const { user, setUser } = useAuth();
  const { types = [] } = useType();
  const [sectionAdd, setSectionAdd] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>('');
  const [typeAdd, setTypeAdd] = useState<string>('');

  if (!user) {
    return null;
  }
  const layoutOrders = user.settings.layout_order;
  if (layoutName && selectedTab == '') {
    const layoutOrder = layoutOrders.find((layoutOrder) => layoutOrder.name === layoutName);
    if (layoutOrder) {
      setSelectedTab(layoutOrder.name);
    }
  } else if (selectedTab == '') {
    setSelectedTab(layoutOrders[1].name);
  }

  const debounce = (func: Function, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(null, args);
      }, delay);
    };
  };

  const handleUpdateSectionList = debounce(async (sections: LayoutOrder[]) => {
    await setUser({ ...user, settings: { ...user.settings, layout_order: sections } });
  }, 500);

  const handleOnSectionDragEnd = (result: any) => {
    if (!result.destination) return;
    const [reorderedItem] = layoutOrders.splice(result.source.index, 1);
    layoutOrders.splice(result.destination.index, 0, reorderedItem);
    handleUpdateSectionList(layoutOrders);
  };

  const handleSectionAdd = (sectionName: string) => {
    const newLayoutOrders = [...layoutOrders, { name: sectionName, icon: 'view_cozy', types: [] }];
    handleUpdateSectionList(newLayoutOrders);
    setSectionAdd(null);
  };

  const handleUpdateTypeList = debounce(async (types: LayoutType[]) => {
    const newLayoutOrders = layoutOrders.map((layoutOrder) => {
      if (layoutOrder.name === selectedTab) {
        return { ...layoutOrder, types };
      }
      return layoutOrder;
    });
    await setUser({ ...user, settings: { ...user.settings, layout_order: newLayoutOrders } });
  }, 500);

  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = layoutOrders.find((layout) => layout.name === selectedTab)?.types ?? [];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    handleUpdateTypeList(items);
  };

  const handleRemoveTypeFromLayout = (typeId: string) => {
    const newLayoutOrders = layoutOrders.map((layoutOrder) => {
      if (layoutOrder.name === selectedTab) {
        return {
          ...layoutOrder,
          types: layoutOrder.types.filter((type) => type.type_id !== typeId)
        };
      }
      return layoutOrder;
    });
    setUser({ ...user, settings: { ...user.settings, layout_order: newLayoutOrders } });
  };

  const handleAddTypeToLayout = (typeId: string) => {
    const newLayoutOrders = layoutOrders.map((layoutOrder) => {
      if (layoutOrder.name === selectedTab) {
        return {
          ...layoutOrder,
          types: [
            ...layoutOrder.types,
            {
              name: types.find((type) => type.id === typeId)?.name ?? '',
              type_id: typeId
            }
          ]
        };
      }
      return layoutOrder;
    });
    setUser({ ...user, settings: { ...user.settings, layout_order: newLayoutOrders } });
  };

  return (
    <Modal {...props} className={cn(props.className, '')} isOpen={isOpen} onClose={onClose} title={'Edit Tab Layout'}>
      <section className='grid h-full grid-cols-[auto_1fr] grid-rows-1'>
        <nav className='h-full space-y-2 overflow-auto rounded p-4'>
          <h3>Sections</h3>
          <div className='h-[90%] rounded border-[1px] border-input-stroke-light p-2 dark:border-input-stroke-dark'>
            <DragDropContext onDragEnd={handleOnSectionDragEnd}>
              <StrictModeDroppable droppableId='characters'>
                {(provided) => (
                  <ul className='characters' {...provided.droppableProps} ref={provided.innerRef}>
                    {layoutOrders.map((layoutOrder: LayoutOrder, index) => {
                      return (
                        <Draggable key={layoutOrder.name} draggableId={layoutOrder.name} index={index}>
                          {(provided) => (
                            <li
                              className='my-1'
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <div
                                key={layoutOrder.name}
                                className={cn(
                                  'relative cursor-pointer rounded px-2 py-2 transition-all hover:bg-secondary/20',
                                  layoutOrder.name === selectedTab && 'animate-appearing bg-secondary/10',
                                  layoutOrder.name === 'Home' && 'cursor-not-allowed hover:bg-transparent',
                                  'align-center flex'
                                )}
                                onClick={() => {
                                  if (layoutOrder.name === 'Home') return;
                                  setSelectedTab(layoutOrder.name);
                                }}
                              >
                                <Icon
                                  className='ml-2 grid size-8 place-content-center rounded-md bg-primary-border-secondary text-xl text-white'
                                  name={layoutOrder.icon}
                                ></Icon>
                                {layoutOrder.name === selectedTab && (
                                  <span className='absolute bottom-0 left-0 top-0 w-[4px] bg-primary'></span>
                                )}
                                <p className='self-center px-4'>{layoutOrder.name}</p>
                              </div>
                            </li>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </ul>
                )}
              </StrictModeDroppable>
            </DragDropContext>
            {sectionAdd === null ? (
              <div
                className={cn(
                  'relative flex cursor-pointer rounded px-2 py-2 align-middle transition-all hover:bg-secondary/20'
                )}
                onClick={() => {
                  setSectionAdd('');
                }}
              >
                <Plus className='ml-2 self-center' size='1rem'></Plus>
                <p className='self-center px-4'>Add Section</p>
              </div>
            ) : (
              <div>
                <TextInput
                  value={sectionAdd}
                  onChange={(e) => {
                    setSectionAdd(e.target.value);
                  }}
                  autoFocus
                  placeholder='Add Section'
                ></TextInput>
                <div className='flex justify-end py-1'>
                  <div className='flex justify-between space-x-2'>
                    <PrimaryButton
                      rounded
                      className='aspect-square rounded-full p-0'
                      onClick={() => {
                        handleSectionAdd(sectionAdd);
                      }}
                    >
                      <Check size='1rem'></Check>
                    </PrimaryButton>
                    <Button
                      rounded
                      className='aspect-square rounded-full p-0'
                      onClick={() => {
                        setSectionAdd(null);
                      }}
                    >
                      <X size='1rem'></X>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>
        <div className='grid h-full grid-cols-1 grid-rows-[auto_auto_1fr] p-4'>
          <h3>Layout Content</h3>
          <div className='my-2 flex w-full justify-center space-x-2 align-middle'>
            <div className='w-full'>
              <DropDown
                defaultValue='Add existing type to layout'
                className='w-full'
                value={typeAdd}
                onValueChange={(value) => {
                  setTypeAdd(value);
                }}
              >
                {types
                  .filter(
                    (type) =>
                      layoutOrders
                        .find((layout) => layout.name === selectedTab)
                        ?.types.findIndex((layoutType) => layoutType.type_id === type.id) === -1
                  )
                  .map((type) => (
                    <DropDownItem key={`${type?.id}_1`} title={type?.name} value={type?.id}>
                      <Item key={type?.id} title={type?.name} value={type?.id} />
                    </DropDownItem>
                  ))}
              </DropDown>
            </div>
            <PrimaryButton
              onClick={() => {
                typeAdd !== '' && handleAddTypeToLayout(typeAdd);
              }}
            >
              Save
            </PrimaryButton>
          </div>
          <div className='h-full overflow-scroll'>
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <StrictModeDroppable droppableId='characters'>
                {(provided) => (
                  <ul className='characters' {...provided.droppableProps} ref={provided.innerRef}>
                    {layoutOrders
                      .find((layout) => layout.name === selectedTab)
                      ?.types.map((type: LayoutType, index) => {
                        return (
                          <Draggable key={type.type_id} draggableId={type.type_id} index={index}>
                            {(provided) => (
                              <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                <div className='py-[2px]'>
                                  <div
                                    className={cn(
                                      'h-10 w-full rounded-sm bg-button-background dark:bg-button-background-dark',
                                      'border-[1px] border-input-stroke-light dark:border-input-stroke-dark',
                                      'flex select-none items-center justify-between overflow-hidden pl-2 pr-4 hover:cursor-move'
                                    )}
                                  >
                                    <div className='flex items-center justify-center space-x-4'>
                                      <GripVertical size='1rem' className='flex-shrink-0 opacity-40' />
                                      <div> {type.name} </div>
                                    </div>

                                    <div className='flex w-fit space-x-2'>
                                      <Button
                                        rounded
                                        className='h-10 w-10 rounded-full border-0 p-0'
                                        onClick={() => {
                                          handleRemoveTypeFromLayout(type.type_id);
                                        }}
                                      >
                                        <Minus size={'1rem'}></Minus>
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            )}
                          </Draggable>
                        );
                      })}
                    {provided.placeholder}
                  </ul>
                )}
              </StrictModeDroppable>
            </DragDropContext>
          </div>
        </div>
      </section>
    </Modal>
  );
};

export default TabLayoutModal;