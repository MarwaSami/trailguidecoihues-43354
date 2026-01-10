import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          closeButton: "group-[.toast]:!h-6 group-[.toast]:!w-6 group-[.toast]:!rounded-full group-[.toast]:!bg-foreground/10 group-[.toast]:!border-foreground/20 group-[.toast]:!text-foreground/80 hover:group-[.toast]:!bg-foreground/20 hover:group-[.toast]:!text-foreground group-[.toast]:!right-2 group-[.toast]:!top-2",
        },
      }}
      closeButton
      {...props}
    />
  );
};

export { Toaster, toast };
