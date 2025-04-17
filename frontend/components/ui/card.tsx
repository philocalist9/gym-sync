import { cn } from "@/lib/utils";
import { ReactNode, MouseEventHandler, FC } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

// Define the Card component with proper typing to allow properties
type CardComponent = FC<CardProps> & {
  Content: FC<CardProps>;
  Header: FC<CardProps>;
  Title: FC<CardProps>;
};

export const Card: FC<CardProps> = ({ children, className, onClick }) => {
  return (
    <div 
      className={cn("bg-white dark:bg-gray-800 rounded-lg overflow-hidden", className)}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const CardContent: FC<CardProps> = ({ children, className }) => {
  return (
    <div className={cn("p-6", className)}>
      {children}
    </div>
  );
};

export const CardHeader: FC<CardProps> = ({ children, className }) => {
  return (
    <div className={cn("px-6 py-4 border-b border-gray-200 dark:border-gray-700", className)}>
      {children}
    </div>
  );
};

export const CardTitle: FC<CardProps> = ({ children, className }) => {
  return (
    <h3 className={cn("text-lg font-semibold text-gray-900 dark:text-white", className)}>
      {children}
    </h3>
  );
};

// Create the compound component
const CardComponent = Card as CardComponent;
CardComponent.Content = CardContent;
CardComponent.Header = CardHeader;
CardComponent.Title = CardTitle;

export default CardComponent; 