import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/utils/api";

function CheckStudent() {
  const [student, setStudent] = useState("SX69");

  const { data: fetchedStudentInfo } =
    api.student.getStudentById.useQuery(student);

  console.log(fetchedStudentInfo);

  return (
    <div className="p-4">
      <Input
        placeholder="Enter Student UID"
        onChange={(e) => {
          setStudent(e.target.value);
        }}
      />
      <Button>Check Student</Button>
    </div>
  );
}

export default CheckStudent;
