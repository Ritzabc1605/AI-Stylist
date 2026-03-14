from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database.connection import Base

# ─────────────────────────────────────────────
# USERS / SELLERS
# ─────────────────────────────────────────────
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    role = Column(String, default="buyer")  # "buyer" | "seller" | "admin"
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    orders = relationship("Order", back_populates="user")
    chat_sessions = relationship("ChatSession", back_populates="user")


# ─────────────────────────────────────────────
# PRODUCTS / CATALOG
# ─────────────────────────────────────────────
class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    sku = Column(String, unique=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String, nullable=False)       # dress, top, bottom, outerwear
    price = Column(Float, nullable=False)
    stock_quantity = Column(Integer, default=0)
    colors = Column(JSON, default=[])               # ["red", "blue"]
    occasions = Column(JSON, default=[])            # ["casual", "beach"]
    climate = Column(JSON, default=[])              # ["tropical", "warm"]
    image_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    outfit_items = relationship("OutfitItem", back_populates="product")


# ─────────────────────────────────────────────
# OUTFIT COMBINATIONS
# ─────────────────────────────────────────────
class OutfitCombination(Base):
    __tablename__ = "outfit_combinations"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("chat_sessions.id"), nullable=True)
    name = Column(String, nullable=True)            # e.g. "Beach Day Look"
    total_price = Column(Float, nullable=False)
    outfit_type = Column(String)                    # "dress" | "separates"
    occasion = Column(String, nullable=True)
    climate = Column(String, nullable=True)
    is_saved = Column(Boolean, default=False)       # user saved this outfit
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    items = relationship("OutfitItem", back_populates="outfit")
    session = relationship("ChatSession", back_populates="outfit_combinations")


class OutfitItem(Base):
    __tablename__ = "outfit_items"

    id = Column(Integer, primary_key=True, index=True)
    outfit_id = Column(Integer, ForeignKey("outfit_combinations.id"))
    product_id = Column(Integer, ForeignKey("products.id"))

    # Relationships
    outfit = relationship("OutfitCombination", back_populates="items")
    product = relationship("Product", back_populates="outfit_items")


# ─────────────────────────────────────────────
# CHAT / CONVERSATION HISTORY
# ─────────────────────────────────────────────
class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    session_token = Column(String, unique=True, index=True)  # for anonymous users
    destination = Column(String, nullable=True)
    duration_days = Column(Integer, nullable=True)
    total_budget = Column(Float, nullable=True)
    status = Column(String, default="active")       # "active" | "completed"
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="chat_sessions")
    messages = relationship("ChatMessage", back_populates="session")
    outfit_combinations = relationship("OutfitCombination", back_populates="session")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("chat_sessions.id"))
    role = Column(String, nullable=False)           # "user" | "assistant"
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    session = relationship("ChatSession", back_populates="messages")


# ─────────────────────────────────────────────
# ORDERS
# ─────────────────────────────────────────────
class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    outfit_combination_id = Column(Integer, ForeignKey("outfit_combinations.id"), nullable=True)
    total_amount = Column(Float, nullable=False)
    status = Column(String, default="pending")      # "pending" | "confirmed" | "shipped" | "delivered"
    payment_status = Column(String, default="unpaid")  # "unpaid" | "paid" | "refunded"
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="orders")