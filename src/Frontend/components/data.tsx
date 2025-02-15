
import dynamic from 'next/dynamic';
const CheckCircle2 = dynamic(() => import('lucide-react').then(mod => mod.CheckCircle2));
const XCircle = dynamic(() => import('lucide-react').then(mod => mod.XCircle));



export const statuses = [
  {
    value: "completed",
    label: "Completed",
    icon: CheckCircle2,
  },
  {
    value: "notcompleted",
    label: "Not Completed",
    icon: XCircle,
  },
  
]

