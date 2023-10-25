import cx from 'classnames';

type Props = { color: string; text: string };

const Tag = ({ color, text }: Props) => {
  const colorClassName = `text-${color}-700 bg-${color}-500 bg-opacity-10`;
  return (
    <div
      className={cx(
        'inline-block w-fit py-1 px-3 rounded-md whitespace-nowrap',
        colorClassName
      )}
    >
      {text}
    </div>
  );
};

export default Tag;
