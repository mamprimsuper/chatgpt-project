"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Share2, BookOpen, LogOut, User } from "lucide-react";
import { Agent } from "@/types";
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ChatHeaderProps {
  agent?: Agent | null;
  onShare?: () => void;
  onSettings?: () => void;
}

export function ChatHeader({ agent, onShare, onSettings }: ChatHeaderProps) {
  const { user, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  if (!agent) return null;

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
  };

  return (
    <>
    <motion.header 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between p-4 border-b border-border"
    >
      <div className="flex items-center gap-4">
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
        >
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${agent.color} text-white shadow-lg ring-1 ring-white/10 flex items-center justify-center`}>
            {React.isValidElement(agent.icon) ? 
              React.cloneElement(agent.icon as React.ReactElement, { 
                className: "w-6 h-6",
                style: { color: 'white' }
              }) : 
              <BookOpen className="w-6 h-6 text-white" />
            }
          </div>
          <div>
            <motion.h1 
              className="text-lg font-semibold"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {agent.name}
            </motion.h1>
            <motion.p 
              className="text-xs text-muted-foreground"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {agent.speciality}
            </motion.p>
          </div>
        </motion.div>
      </div>

      <motion.div 
        className="flex items-center gap-2"
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={onShare}
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={onSettings}
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </motion.div>

        {!user ? (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => setShowAuthModal(true)}
              variant="default"
              size="sm"
              className="ml-2"
            >
              Sign up
            </Button>
          </motion.div>
        ) : (
          <div className="relative ml-2" ref={menuRef}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </button>
            </motion.div>
            
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-md shadow-lg z-50"
              >
                <div className="p-2">
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    {user.email}
                  </div>
                  <hr className="my-2 border-border" />
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </motion.header>
      
      <AuthModal 
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        defaultTab="signup"
      />
    </>
  );
}