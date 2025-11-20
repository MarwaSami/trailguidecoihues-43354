import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, DollarSign, Clock, FileText, Loader2 } from "lucide-react";
import axios from 'axios';
import { baseURL } from '../context/AuthContext';

interface Proposal {
  id: number;
  cover_letter: string;
  proposed_budget: string;
  duration_in_days: number;
  experience?: string;
  status: string;
  job: number;
  freelancer: number;
  created_at?: string;
}

interface Job {
  id: number;
  title: string;
  location: string;
}

interface ProposalDetailsDialogProps {
  proposalId: number;
  freelancerName?: string;
  freelancerLocation?: string;
  trigger?: React.ReactNode;
}

export const ProposalDetailsDialog = ({ proposalId, freelancerName, freelancerLocation, trigger }: ProposalDetailsDialogProps) => {
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchProposal = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}jobs/proposals/${proposalId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });
      const proposalData = response.data;
      setProposal(proposalData);

      // Fetch job data
      if (proposalData.job) {
        const jobResponse = await axios.get(`${baseURL}jobs/jobs/${proposalData.job}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          },
        });
        setJob(jobResponse.data);
      }
    } catch (error) {
      console.error('Error fetching proposal or job:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && proposalId) {
      fetchProposal();
    }
  }, [open, proposalId]);

  const defaultTrigger = (
    <Button variant="outline" className="gap-2 h-11 border-primary/30 hover:border-primary/50 hover:bg-primary/10 transition-all font-semibold">
      <Eye className="w-5 h-5" />
      View Proposal
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-white border border-border shadow-2xl">
        <DialogHeader className="border-b border-border pb-6 mb-6">
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Proposal Details
          </DialogTitle>
          <DialogDescription>
            View the detailed proposal submitted by the freelancer for this job.
          </DialogDescription>
          {proposal && freelancerName && (
            <p className="text-sm text-muted-foreground mt-2">
              Submitted by {freelancerName}{proposal.created_at ? ` on ${new Date(proposal.created_at).toLocaleDateString()}` : ''}
            </p>
          )}
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading proposal...</span>
          </div>
        ) : proposal ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Proposal Text</h3>
              </div>
              <div className="p-5 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border">
                <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">{proposal.cover_letter}</p>
              </div>
            </div>

            {proposal.experience && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center border border-accent/20">
                    <FileText className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Experience</h3>
                </div>
                <div className="p-5 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border">
                  <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">{proposal.experience}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center border border-primary/30 shadow-sm">
                    <DollarSign className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Bid Amount</p>
                    <p className="font-bold text-foreground text-lg">${proposal.proposed_budget}</p>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/30 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center border border-accent/30 shadow-sm">
                    <Clock className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Duration</p>
                    <p className="font-bold text-foreground text-lg">{proposal.duration_in_days} days</p>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/30 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/30 to-secondary/10 flex items-center justify-center border border-secondary/30 shadow-sm">
                    <Eye className="w-6 h-6 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Job Location</p>
                    <p className="font-bold text-foreground text-lg">{job?.location || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Failed to load proposal details.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};