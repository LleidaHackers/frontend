"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const formSchema = z.object({
  projectName: z.string().min(1, {
    message: "Project name is required",
  }),
  companyName: z.string().min(1, {
    message: "Company name is required",
  }),
  country: z.string().min(1, {
    message: "Country is required",
  }),
  totalBudget: z.number({
    invalid_type_error: "Budget is required",
  }),
  space_x: z.number({
    invalid_type_error: "Space x is required",
  }),
  space_y: z.number({
    invalid_type_error: "Space y is required",
  }),
  type: z.enum(["server", "storage", "supercomputer"], {
    errorMap: () => ({ message: "Type is required" }),
  }),
  latituid: z
    .string()
    .min(1, {
      message: "Latitude is required",
    })
    .optional(),
  longitud: z
    .string()
    .min(1, {
      message: "Longitude is required",
    })
    .optional(),
});

const createDataCenter = () => {
  const route = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "server",
    },
  });
  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log("onSubmit fired");
    console.log("SUBMITTING FORM:", data);
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/data-center`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
          }),
        }
      );

      if (res.ok) {
        setLoading(false);
        toast.success("Data center created successfully");
        route.push("/data-centers");
      } else {
        const error = await res.json();
        console.log("Response error:", error);
        toast.error(error.message || "Unknown error");
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.error("Error creating data center", error);
      toast.error(error.message || "Failed to create data center");
    }
  }
  return (
    <div className="p-8 text-lg">
      <Form {...form}>
        <form
          onSubmit={(...args) => {
            form.handleSubmit(onSubmit)(...args);
            console.log("submit tried");
          }}
          className="space-y-8 p-4 md:p-0"
        >
          <div>
            <Card className="p-6 lg:mx-12 shadow-md border">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">
                  Create New Data Center
                </CardTitle>
                <CardDescription className="text-base">
                  Fill in the form below to create a new data center.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <h2 className="my-2 font-bold">Data center information:</h2>
                  <div className="md:flex w-full gap-x-5 pt-2">
                    <FormField
                      control={form.control}
                      name="projectName"
                      render={({ field }) => (
                        <FormItem className="md:w-1/3 py-2">
                          <FormLabel className="text-base font-semibold">
                            Project Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Barcelona Data Center"
                              {...field}
                              className="text-base h-10"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem className="md:w-1/3 py-2">
                          <FormLabel className="text-base font-semibold">
                            Company Name:
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Siemens S.A"
                              {...field}
                              className="text-base h-10"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem className="md:w-1/3 py-2">
                          <FormLabel className="text-base font-semibold">
                            Country:
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Spain"
                              {...field}
                              className="text-base h-10"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div>
                  <h2 className="my-2 font-bold">Data center specs:</h2>
                  <div className="md:flex w-full gap-x-5 pt-2">
                    <FormField
                      control={form.control}
                      name="totalBudget"
                      render={({ field }) => (
                        <FormItem className="md:w-1/3 py-2">
                          <FormLabel className="text-base font-semibold">
                            Aviable Budget
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="1000000"
                              value={field.value}
                              onChange={(e) => field.onChange(+e.target.value)}
                              className="text-base h-10"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="space_x"
                      render={({ field }) => (
                        <FormItem className="md:w-1/3 py-2">
                          <FormLabel className="text-base font-semibold">
                            Space X:
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="10000"
                              {...field}
                              value={field.value}
                              onChange={(e) => field.onChange(+e.target.value)}
                              className="text-base h-10"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="space_y"
                      render={({ field }) => (
                        <FormItem className="md:w-1/3 py-2">
                          <FormLabel className="text-base font-semibold">
                            Space Y:
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="2000"
                              value={field.value}
                              onChange={(e) => field.onChange(+e.target.value)}
                              className="text-base h-10"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem className="py-2 w-full">
                        <FormLabel className="text-base font-semibold">
                          Data Center Type:
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            {["server", "storage", "supercomputer"].map(
                              (option) => (
                                <FormItem
                                  key={option}
                                  className="flex items-center space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <RadioGroupItem value={option} />
                                  </FormControl>
                                  <FormLabel className="font-normal capitalize text-md">
                                    {option}
                                  </FormLabel>
                                </FormItem>
                              )
                            )}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter className="items-center justify-center flex pt-2">
                <Button type="submit" className="text-base h-10 px-6">
                  {loading ? (
                    <>
                      <Loader2
                        size={24}
                        className="mr-2 h-4 w-4 animate-spin"
                      />{" "}
                      <span>Creating...</span>{" "}
                    </>
                  ) : (
                    <>
                      <span className="">Creating Data Center</span>
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default createDataCenter;
