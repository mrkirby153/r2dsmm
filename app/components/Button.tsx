export enum ButtonStyle {
  Primary = "primary",
  Secondary = "secondary",
  Success = "success",
  Danger = "danger",
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  buttonStyle: ButtonStyle;
}

const colors = {
  [ButtonStyle.Primary]: "bg-blue-500 hover:bg-blue-600",
  [ButtonStyle.Secondary]: "bg-gray-500 hover:bg-gray-600",
  [ButtonStyle.Success]: "bg-green-500 hover:bg-green-600",
  [ButtonStyle.Danger]: "bg-red-500 hover:bg-red-600",
};

export function Button(props: ButtonProps) {
  const { className, buttonStyle, ...rest } = props;
  const colorClass = colors[props.buttonStyle];
  const actualClasses = `${className} py-2 px-4 text-white rounded ${colorClass}`;
  return <button className={actualClasses} {...rest} />;
}
