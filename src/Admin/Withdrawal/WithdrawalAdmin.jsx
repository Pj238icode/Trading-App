import {
  getAllWithdrawalRequest,
  proceedWithdrawal,
} from "@/Redux/Withdrawal/Action";
import { readableTimestamp } from "@/Util/readbaleTimestamp";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const WithdrawalAdmin = () => {
  const dispatch = useDispatch();
  const { withdrawal } = useSelector((store) => store);

  useEffect(() => {
    dispatch(getAllWithdrawalRequest(localStorage.getItem("jwt")));
  }, [dispatch]);

  const handleProccedWithdrawal = (id, accept) => {
    dispatch(proceedWithdrawal({ jwt: localStorage.getItem("jwt"), id, accept }));
  };

  return (
    <div className="px-20 py-10 bg-white min-h-screen rounded-xl shadow-md">
      <h1 className="text-3xl font-bold pb-8 text-gray-900">All Withdrawal Requests</h1>
      
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <Table className="w-full">
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="py-5 text-gray-800 font-semibold">Date</TableHead>
              <TableHead className="py-5 text-gray-800 font-semibold">User</TableHead>
              <TableHead className="text-gray-800 font-semibold">Method</TableHead>
              <TableHead className="text-gray-800 font-semibold">Amount</TableHead>
              <TableHead className="text-right text-gray-800 font-semibold">Status</TableHead>
              <TableHead className="text-right text-gray-800 font-semibold">Proceed</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {withdrawal.requests.map((item) => (
              <TableRow key={item.id} className="hover:bg-gray-50 transition-all">
                <TableCell className="font-medium py-5 text-gray-700">
                  {readableTimestamp(item?.date)}
                </TableCell>
                <TableCell>
                  <p className="font-semibold text-gray-900">{item.user.fullName}</p>
                  <p className="text-gray-500 text-sm">{item.user.email}</p>
                </TableCell>
                <TableCell className="text-gray-700">Bank Account</TableCell>
                <TableCell className="text-green-600 font-semibold">
                  {item.amount} USD
                </TableCell>
                <TableCell className="text-right">
                  <Badge
                    className={`text-white ${
                      item.status === "PENDING" ? "bg-red-500" : "bg-green-500"
                    }`}
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="outline-none">
                      <Button variant="outline" className="font-medium">
                        PROCEED
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Button
                          onClick={() => handleProccedWithdrawal(item.id, true)}
                          className="w-full bg-green-500 text-white hover:text-black"
                        >
                          Accept
                        </Button>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Button
                          onClick={() => handleProccedWithdrawal(item.id, false)}
                          className="w-full bg-red-500 text-white hover:text-black"
                        >
                          Decline
                        </Button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default WithdrawalAdmin;
