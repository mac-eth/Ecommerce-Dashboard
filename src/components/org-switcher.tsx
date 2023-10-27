"use client";

import * as React from "react";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "~/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

type OrgSwitcherProps = PopoverTriggerProps;

export default function OrgSwitcher({ className }: OrgSwitcherProps) {
  const { setActive, organizationList, createOrganization, isLoaded } =
    useOrganizationList();
  const { organization } = useOrganization();
  const [open, setOpen] = React.useState(false);
  const [showNewOrgDialog, setShowNewOrgDialog] = React.useState(false);
  const [selectedOrgId, setSelectedOrgId] = React.useState<string>(
    organizationList?.[0]?.organization.id ?? ""
  );
  const formSchema = z.object({
    organizationName: z
      .string()
      .min(4, "Organization Name Must be atleast 4 Characters")
      .max(30, "Organization Name cannot exceed 30 Characters"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationName: "",
    },
  });

  async function onSubmit({ organizationName }: z.infer<typeof formSchema>) {
    if (createOrganization) {
      await createOrganization({
        name: organizationName,
      });
      setShowNewOrgDialog(false);
    } else {
      console.error("createOrganization is not defined");
    }
  }

  return (
    <Dialog open={showNewOrgDialog} onOpenChange={setShowNewOrgDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {isLoaded ? (
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              aria-label="Select a Org"
              className={cn("w-[200px] justify-between", className)}
            >
              <Avatar className="mr-2 h-5 w-5">
                <AvatarImage
                  src={organization?.imageUrl}
                  alt={organization?.name}
                />
                <AvatarFallback>?</AvatarFallback>
              </Avatar>
              {organization?.name}
              <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
            </Button>
          ) : (
            <div className="flex items-center space-x-4">
              <Skeleton className="h-10 w-[200px]" />
            </div>
          )}
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search Org..." />
              <CommandEmpty>No Org found.</CommandEmpty>

              {organizationList?.map((Org) => (
                <CommandItem
                  key={Org.organization.name}
                  value={Org.organization.id}
                  onSelect={() => {
                    void setActive({ organization: Org.organization });
                    setSelectedOrgId(Org.organization.id);
                    setOpen(false);
                  }}
                  className="text-sm"
                >
                  <Avatar className="mr-2 h-5 w-5">
                    <AvatarImage
                      src={Org.organization.imageUrl}
                      alt={Org.organization.name}
                      className="grayscale"
                    />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  {Org.organization.name}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedOrgId === Org.organization.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      setShowNewOrgDialog(true);
                    }}
                  >
                    <PlusCircledIcon className="mr-2 h-5 w-5" />
                    Create Org
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Org</DialogTitle>
          <DialogDescription>
            Add a new Org to manage products and customers.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="organizationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Inc." {...field} />
                  </FormControl>
                  <FormDescription>
                    Add a new Org to manage products and customers.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowNewOrgDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Continue</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
