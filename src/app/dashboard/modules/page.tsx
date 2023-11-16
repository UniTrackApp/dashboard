"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/utils/api";

import { type Module } from "@prisma/client";

export default function Modules() {
  const [formData, setFormData] = useState<Module>({
    moduleId: "",
    moduleName: "",
    moduleDesc: "",
  });
  const { data: allModules, refetch: refetchAllModules } =
    api.module.getAllModules.useQuery();
  const { mutate: createNewModule } = api.module.createNewModule.useMutation();

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
              moduleDesc: e.target.value,
            })
          }
        />
        <Button
          onClick={() => {
            createNewModule(formData);
            void refetchAllModules();
          }}
        >
          Submit
        </Button>
      </div>

      {/* DISPLAYING DATA */}
      {allModules?.map((module) => (
        <div key={module.moduleId}>
          {module.moduleId}
          {module.moduleName}
          {module.moduleDesc}
        </div>
      ))}
    </>
  );
}
