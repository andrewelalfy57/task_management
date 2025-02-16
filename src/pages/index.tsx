"use client"; // Ensures this is a client component

import React, { useEffect, useState, Fragment } from "react";
import axios from "axios";
import { columns } from "../Frontend/components/columns";
import { DataTable } from "../Frontend/components/data-table";
export default function AdvancedTable() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`);
        const tasks = response.data as {
          _id: string;
          title: string;
          description: string;
          completed: boolean;
          createdAt: string;
        }[];

        // Convert dates on the client side
        const formattedData = tasks.map((task) => ({
          id: task._id,
          title: task.title,
          description: task.description,
          status: task.completed ? "completed" : "notcompleted",
          createdAt: new Intl.DateTimeFormat("en-US").format(
            new Date(task.createdAt)
          ),
        }));

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Failed to load data.</p>;

  return (
    <Fragment>
      <DataTable data={data} columns={columns} />
    </Fragment>
  );
}
