import { cn } from "@/lib/utils";

export const H3 = (props: React.HTMLProps<HTMLHeadingElement>) => {
  return (
    <h3
      {...props}
      className={cn("text-xl font-semibold tracking-tight", props.className)}
    />
  );
};
