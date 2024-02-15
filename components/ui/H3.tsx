import { cn } from "@/lib/utils";

export const H1 = (props: React.HTMLProps<HTMLHeadingElement>) => {
  return (
    <h1
      {...props}
      className={cn("text-xl font-semibold tracking-tight", props.className)}
    />
  );
};
