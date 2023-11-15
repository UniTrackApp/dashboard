"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/utils/api";

type FormData = {
  moduleId: string;
  moduleName: string;
  moduleDescription: string;
};

export default function Modules() {
  const [formData, setFormData] = useState<FormData>({
    moduleId: "",
    moduleName: "",
    moduleDescription: "",
  });
  const { data, refetch } = api.module.getAllModules.useQuery();
  const { mutate } = api.module.createNewModule.useMutation();

  return (
    <>
      <p>Add a new module</p>

      {/* FORM */}
      <div>
        <Label>Module ID</Label>
        <Input
          onChange={(e) =>
            setFormData({
              ...formData,
              moduleId: e.target.value,
            })
          }
        />
        <Label>Module Name</Label>
        <Input
          onChange={(e) =>
            setFormData({
              ...formData,
              moduleName: e.target.value,
            })
          }
        />
        <Label>Module Description</Label>
        <Input
          onChange={(e) =>
            setFormData({
              ...formData,
              moduleDescription: e.target.value,
            })
          }
        />
        <Button
          onClick={() => {
            mutate(formData);
            void refetch();
          }}
        >
          Submit
        </Button>
      </div>

      {/* DISPLAYING DATA */}
      {data?.map((item) => (
        <div key={item.moduleId}>
          {item.moduleId}
          {item.moduleName}
          {item.moduleDesc}
        </div>
      ))}
    </>
  );
}
