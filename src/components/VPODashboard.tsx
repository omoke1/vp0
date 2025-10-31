"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Users,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Download,
  ExternalLink,
  Plus,
  BarChart3,
  PieChart,
  LineChart,
  Globe,
  Shield,
  Zap,
  FileText,
  Code,
  Vote,
  AlertCircle,
  ChevronRight,
  Copy,
  Twitter,
  Github,
  MessageCircle,
  Bookmark,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { connectWallet, WalletState } from "../web3/eth";
import { getContract } from "../web3/eth";
import { web3Config, isContractsConfigured } from "../web3/config";
import { useEffect } from "react";
import { ethers } from "ethers";

interface StatCardProps {
  title: string;
  value: string;
  trend?: number;
  icon: React.ReactNode;
}

function StatCard({ title, value, trend, icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend !== undefined && (
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            {trend > 0 ? (
              <>
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-green-500">+{trend}%</span>
              </>
            ) : (
              <>
                <TrendingDown className="w-3 h-3 text-red-500" />
                <span className="text-red-500">{trend}%</span>
              </>
            )}
            <span>from last month</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}

interface Resolution {
  id: string;
  market: string;
  question: string;
  result: string;
  proofCID: string;
  timestamp: string;
  platform: string;
}

interface Market {
  id: string;
  question: string;
  platform: string;
  status: string;
  result: string;
  category: string;
  proofIds: string[];
}

interface Proof {
  id: string;
  jobId: string;
  result: string;
  computedBy: string;
  timestamp: string;
  ipfsCID: string;
  signature: string;
  marketId: string;
}

interface Operator {
  id: string;
  nodeId: string;
  staked: string;
  jobsCompleted: number;
  lastHeartbeat: string;
  status: string;
  completionRate: number;
  latency: string;
  rewards: string;
}

interface Proposal {
  id: string;
  title: string;
  status: string;
  votes: { yes: number; no: number };
  endDate: string;
}

interface VPODashboardProps {
  onBackToLanding?: () => void;
}

export default function VPODashboard({ onBackToLanding }: VPODashboardProps) {
  const [selectedResolution, setSelectedResolution] = useState<Resolution | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [selectedProof, setSelectedProof] = useState<Proof | null>(null);
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
  const [platformFilter, setPlatformFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [wallet, setWallet] = useState<WalletState>({});
  const [isConnecting, setIsConnecting] = useState(false);
  const [totalProofs, setTotalProofs] = useState<number | null>(null);
  const [validProofs, setValidProofs] = useState<number | null>(null);
  const [proofQuery, setProofQuery] = useState<string>("");
  const [proofExistsResult, setProofExistsResult] = useState<boolean | null>(null);
  const [txStatus, setTxStatus] = useState<string>("");

  async function refreshRegistryStats() {
    try {
      if (!wallet.provider || !isContractsConfigured()) return;
      const provider = wallet.provider;
      const registry = await getContract("ProofRegistry", provider);
      const _total = await registry.totalProofs();
      const _valid = await registry.validProofs();
      setTotalProofs(Number(_total));
      setValidProofs(Number(_valid));
    } catch (e) {
      console.error("refreshRegistryStats", e);
    }
  }

  async function checkProofExists() {
    try {
      if (!wallet.provider || !isContractsConfigured() || !proofQuery) return;
      const provider = wallet.provider;
      const registry = await getContract("ProofRegistry", provider);
      // expect hex bytes32 like 0x...
      const exists: boolean = await registry.proofExists(proofQuery);
      setProofExistsResult(exists);
    } catch (e) {
      console.error("checkProofExists", e);
      setProofExistsResult(null);
    }
  }

  async function registerProofMinimal() {
    try {
      if (!wallet.signer || !isContractsConfigured() || !proofQuery) return;
      setTxStatus("pending");
      const signer = wallet.signer;
      const registry = await getContract("ProofRegistry", signer);
      // minimal placeholder fields; marketId/result can be dummy values while wiring
      const marketId = proofQuery; // bytes32
      const result = proofQuery; // bytes32
      const proofData = "0x"; // empty bytes
      const tx = await registry.registerProof(proofQuery, marketId, result, proofData);
      await tx.wait();
      setTxStatus("success");
      await refreshRegistryStats();
    } catch (e) {
      console.error("registerProofMinimal", e);
      setTxStatus("error");
    }
  }

  useEffect(() => {
    // auto-refresh on wallet connect
    refreshRegistryStats();
  }, [wallet.address]);

  const resolutions: Resolution[] = [
    {
      id: "1",
      market: "Polymarket",
      question: "Will Bitcoin reach $100k in 2024?",
      result: "Yes",
      proofCID: "Qm...abc123",
      timestamp: "2024-01-15 14:32:00",
      platform: "Polymarket",
    },
    {
      id: "2",
      market: "Gnosis",
      question: "Will ETH surpass $5000?",
      result: "No",
      proofCID: "Qm...def456",
      timestamp: "2024-01-15 13:20:00",
      platform: "Gnosis",
    },
    {
      id: "3",
      market: "Polymarket",
      question: "Will AI regulation pass in 2024?",
      result: "Yes",
      proofCID: "Qm...ghi789",
      timestamp: "2024-01-15 12:15:00",
      platform: "Polymarket",
    },
  ];

  const markets: Market[] = [
    {
      id: "m1",
      question: "Will Bitcoin reach $100k in 2024?",
      platform: "Polymarket",
      status: "Resolved",
      result: "Yes",
      category: "Crypto",
      proofIds: ["p1", "p2"],
    },
    {
      id: "m2",
      question: "Will ETH surpass $5000?",
      platform: "Gnosis",
      status: "Resolved",
      result: "No",
      category: "Crypto",
      proofIds: ["p3"],
    },
    {
      id: "m3",
      question: "Will AI regulation pass in 2024?",
      platform: "Polymarket",
      status: "Active",
      result: "Pending",
      category: "Politics",
      proofIds: [],
    },
  ];

  const proofs: Proof[] = [
    {
      id: "p1",
      jobId: "job_001",
      result: "Verified",
      computedBy: "Node_Alpha",
      timestamp: "2024-01-15 14:32:00",
      ipfsCID: "Qm...abc123",
      signature: "0x1234...5678",
      marketId: "m1",
    },
    {
      id: "p2",
      jobId: "job_002",
      result: "Verified",
      computedBy: "Node_Beta",
      timestamp: "2024-01-15 13:20:00",
      ipfsCID: "Qm...def456",
      signature: "0x5678...9abc",
      marketId: "m1",
    },
    {
      id: "p3",
      jobId: "job_003",
      result: "Verified",
      computedBy: "Node_Gamma",
      timestamp: "2024-01-15 12:15:00",
      ipfsCID: "Qm...ghi789",
      signature: "0x9abc...def0",
      marketId: "m2",
    },
  ];

  const operators: Operator[] = [
    {
      id: "1",
      nodeId: "Node_Alpha",
      staked: "50,000 VPO",
      jobsCompleted: 1247,
      lastHeartbeat: "2 min ago",
      status: "Online",
      completionRate: 99.8,
      latency: "45ms",
      rewards: "12,450 VPO",
    },
    {
      id: "2",
      nodeId: "Node_Beta",
      staked: "35,000 VPO",
      jobsCompleted: 892,
      lastHeartbeat: "1 min ago",
      status: "Online",
      completionRate: 98.5,
      latency: "52ms",
      rewards: "8,920 VPO",
    },
    {
      id: "3",
      nodeId: "Node_Gamma",
      staked: "25,000 VPO",
      jobsCompleted: 654,
      lastHeartbeat: "15 min ago",
      status: "Offline",
      completionRate: 97.2,
      latency: "N/A",
      rewards: "6,540 VPO",
    },
  ];

  const proposals: Proposal[] = [
    {
      id: "1",
      title: "Increase minimum stake requirement to 100k VPO",
      status: "Active",
      votes: { yes: 1250000, no: 450000 },
      endDate: "2024-01-20",
    },
    {
      id: "2",
      title: "Add support for Arbitrum markets",
      status: "Active",
      votes: { yes: 980000, no: 320000 },
      endDate: "2024-01-22",
    },
  ];

  const filteredMarkets = markets.filter((market) => {
    if (platformFilter !== "all" && market.platform !== platformFilter) return false;
    if (statusFilter !== "all" && market.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground truncate">VPO Dashboard</h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1 truncate">
                Verifiable Prediction Oracle Network
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-xs sm:text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                <span className="hidden sm:inline">Network Online</span>
                <span className="sm:hidden">Online</span>
              </Badge>
              {!wallet.address ? (
                <button
                  onClick={async () => {
                    try {
                      setIsConnecting(true);
                      const ws = await connectWallet();
                      setWallet(ws);
                    } catch (err) {
                      console.error(err);
                    } finally {
                      setIsConnecting(false);
                    }
                  }}
                  disabled={isConnecting}
                  className="h-8 px-2 sm:px-3 inline-flex items-center justify-center rounded-lg border border-border bg-background text-xs sm:text-sm font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {isConnecting ? 'Connecting…' : <>
                    <span className="hidden sm:inline">Connect Wallet</span>
                    <span className="sm:hidden">Connect</span>
                  </>}
                </button>
              ) : (
                <div className="h-8 px-2 sm:px-3 inline-flex items-center justify-center rounded-lg border border-border bg-background text-xs sm:text-sm font-medium text-foreground shadow-sm">
                  {wallet.address.slice(0,6)}…{wallet.address.slice(-4)}
                </div>
              )}
              <button
                onClick={onBackToLanding}
                className="h-8 px-2 sm:px-3 inline-flex items-center justify-center rounded-lg border border-border bg-background text-xs sm:text-sm font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <span className="hidden sm:inline">Sign Out</span>
                <span className="sm:hidden">Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 h-auto">
            <TabsTrigger value="overview" className="text-xs sm:text-sm py-2">Overview</TabsTrigger>
            <TabsTrigger value="markets" className="text-xs sm:text-sm py-2">Markets</TabsTrigger>
            <TabsTrigger value="proofs" className="text-xs sm:text-sm py-2">Proofs</TabsTrigger>
            <TabsTrigger value="operators" className="text-xs sm:text-sm py-2">Operators</TabsTrigger>
            <TabsTrigger value="developers" className="text-xs sm:text-sm py-2">Dev</TabsTrigger>
            <TabsTrigger value="governance" className="text-xs sm:text-sm py-2">Gov</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
              <StatCard
                title="Total Predictions"
                value="12,847"
                trend={12.5}
                icon={<Activity className="w-4 h-4 text-muted-foreground" />}
              />
              <StatCard
                title="Integrated Markets"
                value="247"
                trend={8.2}
                icon={<Globe className="w-4 h-4 text-muted-foreground" />}
              />
              <StatCard
                title="Active Jobs"
                value="42"
                icon={<Clock className="w-4 h-4 text-muted-foreground" />}
              />
              <StatCard
                title="Proofs Verified"
                value="99.8%"
                trend={0.3}
                icon={<Shield className="w-4 h-4 text-muted-foreground" />}
              />
              <StatCard
                title="$VPO Staked"
                value="2.4M"
                trend={15.7}
                icon={<Zap className="w-4 h-4 text-muted-foreground" />}
              />
            </div>

            {/* Charts and Activity */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
              {/* Recent Resolutions */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Resolutions</CardTitle>
                  <CardDescription>Latest verified prediction outcomes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[100px]">Market</TableHead>
                          <TableHead className="min-w-[200px]">Question</TableHead>
                          <TableHead className="min-w-[80px]">Result</TableHead>
                          <TableHead className="min-w-[120px]">Proof CID</TableHead>
                          <TableHead className="min-w-[140px]">Timestamp</TableHead>
                        </TableRow>
                      </TableHeader>
                    <TableBody>
                      {resolutions.map((resolution) => (
                        <TableRow
                          key={resolution.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setSelectedResolution(resolution)}
                        >
                          <TableCell>
                            <Badge variant="outline">{resolution.market}</Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {resolution.question}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                resolution.result === "Yes"
                                  ? "bg-green-500/10 text-green-500"
                                  : "bg-red-500/10 text-red-500"
                              }
                            >
                              {resolution.result}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {resolution.proofCID}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {resolution.timestamp}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Activity Charts */}
              <Card>
                <CardHeader>
                  <CardTitle>Resolutions Over Time</CardTitle>
                  <CardDescription>Last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center border border-dashed border-border rounded-lg">
                    <div className="text-center text-muted-foreground">
                      <LineChart className="w-12 h-12 mx-auto mb-2" />
                      <p className="text-sm">Line chart visualization</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Market Share</CardTitle>
                  <CardDescription>By platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center border border-dashed border-border rounded-lg">
                    <div className="text-center text-muted-foreground">
                      <PieChart className="w-12 h-12 mx-auto mb-2" />
                      <p className="text-sm">Pie chart visualization</p>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Polymarket</span>
                          <span className="font-semibold">65%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Gnosis</span>
                          <span className="font-semibold">35%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button className="gap-2 w-full sm:w-auto">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Create New Adapter</span>
                <span className="sm:hidden">New Adapter</span>
              </Button>
              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">View Proof Explorer</span>
                <span className="sm:hidden">Proof Explorer</span>
              </Button>
              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                <Zap className="w-4 h-4" />
                <span className="hidden sm:inline">Run Test Job</span>
                <span className="sm:hidden">Test Job</span>
              </Button>
            </div>
          </TabsContent>

          {/* Markets Tab */}
          <TabsContent value="markets" className="space-y-4 sm:space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Market Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label>Platform</Label>
                    <Select value={platformFilter} onValueChange={setPlatformFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Platforms</SelectItem>
                        <SelectItem value="Polymarket">Polymarket</SelectItem>
                        <SelectItem value="Gnosis">Gnosis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="crypto">Crypto</SelectItem>
                        <SelectItem value="politics">Politics</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Markets Grid */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMarkets.map((market) => (
                <Card
                  key={market.id}
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => setSelectedMarket(market)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base line-clamp-2">
                        {market.question}
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className={
                          market.status === "Active"
                            ? "bg-blue-500/10 text-blue-500"
                            : "bg-green-500/10 text-green-500"
                        }
                      >
                        {market.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Platform</span>
                      <Badge variant="secondary">{market.platform}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Category</span>
                      <span className="font-medium">{market.category}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Result</span>
                      <span className="font-medium">{market.result}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Proofs</span>
                      <span className="font-medium">{market.proofIds.length}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Market Details Dialog */}
            <Dialog open={!!selectedMarket} onOpenChange={() => setSelectedMarket(null)}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{selectedMarket?.question}</DialogTitle>
                  <DialogDescription>Market Details and Verification</DialogDescription>
                </DialogHeader>
                {selectedMarket && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Platform</Label>
                        <p className="text-sm font-medium mt-1">{selectedMarket.platform}</p>
                      </div>
                      <div>
                        <Label>Status</Label>
                        <p className="text-sm font-medium mt-1">{selectedMarket.status}</p>
                      </div>
                      <div>
                        <Label>Category</Label>
                        <p className="text-sm font-medium mt-1">{selectedMarket.category}</p>
                      </div>
                      <div>
                        <Label>Result</Label>
                        <p className="text-sm font-medium mt-1">{selectedMarket.result}</p>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <Label>Linked Proof IDs</Label>
                      <div className="mt-2 space-y-2">
                        {selectedMarket.proofIds.map((proofId) => (
                          <div
                            key={proofId}
                            className="flex items-center justify-between p-2 border rounded-lg"
                          >
                            <span className="font-mono text-sm">{proofId}</span>
                            <Button size="sm" variant="ghost">
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button className="w-full">View Full Proof</Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Proof Explorer Tab */}
          <TabsContent value="proofs" className="space-y-4 sm:space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Search Proofs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="flex-1">
                    <Input placeholder="Search by Market ID, Proof ID, or CID..." />
                  </div>
                  <Button variant="outline" className="gap-2 w-full sm:w-auto">
                    <Filter className="w-4 h-4" />
                    <span className="hidden sm:inline">Filters</span>
                    <span className="sm:hidden">Filter</span>
                  </Button>
                </div>
              </CardContent>
            </Card>


            {/* Proofs Table */}
            <Card>
              <CardHeader>
                <CardTitle>Verified Proofs</CardTitle>
                <CardDescription>All verified prediction proofs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[100px]">Job ID</TableHead>
                        <TableHead className="min-w-[80px]">Result</TableHead>
                        <TableHead className="min-w-[120px]">Computed By</TableHead>
                        <TableHead className="min-w-[140px]">Timestamp</TableHead>
                        <TableHead className="min-w-[120px]">IPFS CID</TableHead>
                        <TableHead className="min-w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                  <TableBody>
                    {proofs.map((proof) => (
                      <TableRow key={proof.id}>
                        <TableCell className="font-mono text-xs">{proof.jobId}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500/10 text-green-500">
                            {proof.result}
                          </Badge>
                        </TableCell>
                        <TableCell>{proof.computedBy}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {proof.timestamp}
                        </TableCell>
                        <TableCell className="font-mono text-xs">{proof.ipfsCID}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedProof(proof)}
                            >
                              Details
                            </Button>
                            <Button size="sm" variant="ghost">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Proof Details Dialog */}
            <Dialog open={!!selectedProof} onOpenChange={() => setSelectedProof(null)}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Proof Details</DialogTitle>
                  <DialogDescription>Verification information</DialogDescription>
                </DialogHeader>
                {selectedProof && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Job ID</Label>
                        <p className="text-sm font-mono mt-1">{selectedProof.jobId}</p>
                      </div>
                      <div>
                        <Label>Result</Label>
                        <p className="text-sm font-medium mt-1">{selectedProof.result}</p>
                      </div>
                      <div>
                        <Label>Computed By</Label>
                        <p className="text-sm font-medium mt-1">{selectedProof.computedBy}</p>
                      </div>
                      <div>
                        <Label>Timestamp</Label>
                        <p className="text-sm font-medium mt-1">{selectedProof.timestamp}</p>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <Label>IPFS CID</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="flex-1 p-2 bg-muted rounded text-sm">
                          {selectedProof.ipfsCID}
                        </code>
                        <Button size="sm" variant="ghost">
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label>Signature</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="flex-1 p-2 bg-muted rounded text-sm truncate">
                          {selectedProof.signature}
                        </code>
                        <Button size="sm" variant="ghost">
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1 gap-2">
                        <ExternalLink className="w-4 h-4" />
                        View on IPFS
                      </Button>
                      <Button variant="outline" className="flex-1 gap-2">
                        <Shield className="w-4 h-4" />
                        Verify Signature
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Operators Tab */}
          <TabsContent value="operators" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Operator Registry</CardTitle>
                    <CardDescription>Network node operators</CardDescription>
                  </div>
                  <Button className="gap-2 w-full sm:w-auto">
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Register Operator</span>
                    <span className="sm:hidden">Register</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[120px]">Node ID</TableHead>
                        <TableHead className="min-w-[100px]">Staked</TableHead>
                        <TableHead className="min-w-[120px]">Jobs Completed</TableHead>
                        <TableHead className="min-w-[120px]">Completion Rate</TableHead>
                        <TableHead className="min-w-[80px]">Latency</TableHead>
                        <TableHead className="min-w-[80px]">Status</TableHead>
                        <TableHead className="min-w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                  <TableBody>
                    {operators.map((operator) => (
                      <TableRow key={operator.id}>
                        <TableCell className="font-medium">{operator.nodeId}</TableCell>
                        <TableCell>{operator.staked}</TableCell>
                        <TableCell>{operator.jobsCompleted.toLocaleString()}</TableCell>
                        <TableCell>{operator.completionRate}%</TableCell>
                        <TableCell>{operator.latency}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              operator.status === "Online"
                                ? "bg-green-500/10 text-green-500"
                                : "bg-gray-500/10 text-gray-500"
                            }
                          >
                            {operator.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost" onClick={() => setSelectedOperator(operator)}>
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Operator Details Dialog */}
            <Dialog open={!!selectedOperator} onOpenChange={() => setSelectedOperator(null)}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Operator Details</DialogTitle>
                  <DialogDescription>Node performance and staking information</DialogDescription>
                </DialogHeader>
                {selectedOperator && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Node ID</Label>
                        <p className="text-sm font-medium mt-1">{selectedOperator.nodeId}</p>
                      </div>
                      <div>
                        <Label>Status</Label>
                        <div className="mt-1">
                          <Badge className={selectedOperator.status === 'Online' ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'}>
                            {selectedOperator.status}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <Label>Staked</Label>
                        <p className="text-sm font-medium mt-1">{selectedOperator.staked}</p>
                      </div>
                      <div>
                        <Label>Rewards</Label>
                        <p className="text-sm font-medium mt-1">{selectedOperator.rewards}</p>
                      </div>
                      <div>
                        <Label>Jobs Completed</Label>
                        <p className="text-sm font-medium mt-1">{selectedOperator.jobsCompleted.toLocaleString()}</p>
                      </div>
                      <div>
                        <Label>Completion Rate</Label>
                        <p className="text-sm font-medium mt-1">{selectedOperator.completionRate}%</p>
                      </div>
                      <div>
                        <Label>Latency</Label>
                        <p className="text-sm font-medium mt-1">{selectedOperator.latency}</p>
                      </div>
                      <div>
                        <Label>Last Heartbeat</Label>
                        <p className="text-sm font-medium mt-1">{selectedOperator.lastHeartbeat}</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" className="w-full">View Activity</Button>
                      <Button className="w-full">Contact Operator</Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            {/* Performance Metrics */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Average Completion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">98.5%</div>
                  <p className="text-xs text-muted-foreground mt-1">Across all operators</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Average Latency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">48ms</div>
                  <p className="text-xs text-muted-foreground mt-1">Network average</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Total Rewards</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">27,910 VPO</div>
                  <p className="text-xs text-muted-foreground mt-1">Distributed this month</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Developers Tab */}
          <TabsContent value="developers" className="space-y-4 sm:space-y-6">
            <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
              {/* Quick Start Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Start</CardTitle>
                  <CardDescription>Get started with VPO integration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted p-3 rounded-lg font-mono text-sm">
                    npm install @vpo/sdk
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                      <ExternalLink className="w-4 h-4" />
                      View Documentation
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Download className="w-4 h-4" />
                      Download SDK
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* API Endpoints Card */}
              <Card>
                <CardHeader>
                  <CardTitle>API Endpoints</CardTitle>
                  <CardDescription>Available REST API endpoints</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-muted p-3 rounded-lg font-mono text-sm">
                    GET /api/v1/proofs/:cid
                  </div>
                  <div className="bg-muted p-3 rounded-lg font-mono text-sm">
                    POST /api/v1/verify
                  </div>
                  <div className="bg-muted p-3 rounded-lg font-mono text-sm">
                    GET /api/v1/markets
                  </div>
                </CardContent>
              </Card>

              {/* On-chain Wiring (minimal) */}
              <Card>
                <CardHeader>
                  <CardTitle>On-chain Integration</CardTitle>
                  <CardDescription>Reads and minimal write wired to local contracts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Total Proofs</Label>
                      <div className="mt-1 text-sm font-medium">{totalProofs ?? '-'}{!isContractsConfigured() && ' (contracts not configured)'}</div>
                    </div>
                    <div>
                      <Label>Valid Proofs</Label>
                      <div className="mt-1 text-sm font-medium">{validProofs ?? '-'}</div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <Label>bytes32 Proof Hash</Label>
                      <Input placeholder="0x… (bytes32)" value={proofQuery} onChange={(e) => setProofQuery(e.target.value)} />
                    </div>
                    <div className="flex items-end gap-2">
                      <Button variant="outline" onClick={refreshRegistryStats}>Refresh</Button>
                      <Button variant="outline" onClick={checkProofExists}>Check</Button>
                      <Button onClick={registerProofMinimal} disabled={!wallet.signer || !proofQuery}>
                        Register
                      </Button>
                    </div>
                  </div>
                  {proofExistsResult !== null && (
                    <div className="text-sm text-muted-foreground">proofExists: {String(proofExistsResult)}</div>
                  )}
                  {!!txStatus && (
                    <div className={"text-sm " + (txStatus === 'success' ? 'text-green-600' : txStatus === 'error' ? 'text-red-600' : 'text-muted-foreground')}>
                      {txStatus === 'pending' ? 'Submitting…' : txStatus === 'success' ? 'Transaction confirmed' : txStatus === 'error' ? 'Transaction failed' : ''}
                    </div>
                  )}
                </CardContent>
              </Card>

            </div>

            {/* Example Integration Card */}
            <Card>
              <CardHeader>
                <CardTitle>Example Integration</CardTitle>
                <CardDescription>Sample code for adapter deployment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <pre className="whitespace-pre-wrap">{`import { VPOAdapter } from '@vpo/sdk';
 
 const adapter = new VPOAdapter({
   network: 'mainnet',
   apiKey: process.env.VPO_API_KEY
 });
 
 // Resolve a market
 const result = await adapter.resolve({
   marketId: 'M001',
   question: 'Will BTC reach $50k?',
   dataSource: 'coinbase'
 });
 
 console.log(result.proof);`}</pre>
                </div>
              </CardContent>
            </Card>

          </TabsContent>

          {/* Governance Tab */}
          <TabsContent value="governance" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Governance</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Protocol upgrades and community participation
                </CardDescription>
              </CardHeader>
              <CardContent className="py-16">
                <div className="flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
                    <Users className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-medium text-foreground">
                      Governance features coming soon
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Future-proof for decentralization and community participation
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="border-t py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
              © 2025 VPO Network. All rights reserved.
            </p>
            <div className="flex items-center gap-3 sm:gap-4">
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <Bookmark className="w-4 h-4" />
              </button>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="w-4 h-4" />
              </button>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <Globe className="w-4 h-4" />
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
