import { useAppSelector } from '../../redux/hooks';
import { useDispatch } from 'react-redux';
import TagBox from '../../components/write/TagBox';
import { changeField } from '../../redux/slices/writeSlice';

const TagBoxContainer = () => {
  const dispatch = useDispatch();
  const tags = useAppSelector((state) => state.write.tags);
  const onChangeTags = (nextTags: string[]) => {
    dispatch(changeField({ key: 'tags', value: nextTags }));
  };
  return <TagBox onChangeTags={onChangeTags} tags={tags} />;
};

export default TagBoxContainer;
