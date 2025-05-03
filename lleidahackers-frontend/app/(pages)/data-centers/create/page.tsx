"use client";

import { useForm } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type DataCenterForm = {
  name: string;
  company: string;
  address: string;
  externalNetwork: number;
  gridConnection: number;
  waterConnection: number;
  spaceX: number;
  spaceY: number;
  dataStorage: number;
  processing: number;
  price: number;
};

export default function CreateDataCenter() {
  const { register, handleSubmit, reset } = useForm<DataCenterForm>();

  const onSubmit = (data: DataCenterForm) => {
    console.log("Creating datacenter:", data);
    // Aquí puedes hacer un fetch al backend si lo deseas
    reset();
  };

  return (
    <Card className="h-screen w-full flex flex-col justify-center items-center">
      <CardHeader>
        <CardTitle>Create New Data Center</CardTitle>
      </CardHeader>
      <CardContent className="w-full max-w-4xl">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label>Data Center Name</Label>
            <Input type="text" {...register("name")} />
          </div>
          <div className="col-span-2">
            <Label>Company</Label>
            <Input type="text" {...register("company")} />
          </div>
          <div className="col-span-2">
            <Label>Address</Label>
            <Input type="text" {...register("address")} />
          </div>
          <div>
            <Label>External Network</Label>
            <Input type="number" {...register("externalNetwork")} />
          </div>
          <div>
            <Label>Grid Connection</Label>
            <Input type="number" {...register("gridConnection")} />
          </div>
          <div>
            <Label>Water Connection</Label>
            <Input type="number" {...register("waterConnection")} />
          </div>
          <div>
            <Label>Space X</Label>
            <Input type="number" {...register("spaceX")} />
          </div>
          <div>
            <Label>Space Y</Label>
            <Input type="number" {...register("spaceY")} />
          </div>
          <div>
            <Label>Data Storage</Label>
            <Input type="number" {...register("dataStorage")} />
          </div>
          <div>
            <Label>Processing</Label>
            <Input type="number" {...register("processing")} />
          </div>
          <div>
            <Label>Price</Label>
            <Input type="number" {...register("price")} />
          </div>
          <div className="col-span-2">
            <Button type="submit" className="w-full">
              Create Data Center
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}