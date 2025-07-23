import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AlertCircle, MessageSquarePlus } from "lucide-react";

interface MessageLimitWarningProps {
  onNewChat: () => void;
}

export function MessageLimitWarning({ onNewChat }: MessageLimitWarningProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto px-4 mb-4 w-full md:max-w-3xl"
    >
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="text-sm font-medium text-amber-600 dark:text-amber-400 mb-1">
              Limite de mensagens atingido
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              Esta conversa atingiu o limite de 20 mensagens. Para continuar conversando, inicie um novo chat.
            </p>
            <Button 
              onClick={onNewChat}
              size="sm"
              className="gap-2"
              variant="secondary"
            >
              <MessageSquarePlus className="w-4 h-4" />
              Iniciar novo chat
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}