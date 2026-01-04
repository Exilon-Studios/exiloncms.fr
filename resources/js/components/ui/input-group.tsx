import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const InputGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex min-w-0 items-center",
        className
      )}
      {...props}
    />
  )
})
InputGroup.displayName = "InputGroup"

interface InputGroupAddonProps extends React.ComponentProps<"div"> {
  align?: "inline-start" | "inline-end" | "block-start" | "block-end"
}

const InputGroupAddon = React.forwardRef<
  HTMLDivElement,
  InputGroupAddonProps
>(({ className, align = "inline-start", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center",
        className
      )}
      {...props}
    />
  )
})
InputGroupAddon.displayName = "InputGroupAddon"

interface InputGroupButtonProps extends Omit<ButtonProps, "size"> {
  size?: "sm" | "default" | "icon"
}

const InputGroupButton = React.forwardRef<
  HTMLButtonElement,
  InputGroupButtonProps
>(({ className, size = "sm", variant = "default", ...props }, ref) => {
  return (
    <Button
      ref={ref}
      size={size}
      variant={variant}
      className={className}
      {...props}
    />
  )
})
InputGroupButton.displayName = "InputGroupButton"

const InputGroupInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      className={cn("rounded-r-none", className)}
      {...props}
    />
  )
})
InputGroupInput.displayName = "InputGroupInput"

const InputGroupTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<typeof Textarea>
>(({ className, ...props }, ref) => {
  return (
    <Textarea
      ref={ref}
      className={cn("min-w-0 flex-1 resize-none", className)}
      {...props}
    />
  )
})
InputGroupTextarea.displayName = "InputGroupTextarea"

const InputGroupText = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn("text-sm", className)}
      {...props}
    />
  )
})
InputGroupText.displayName = "InputGroupText"

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
}
